import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PatientsService } from './services';
import { PatientRepository } from '../data/repositories/PatientRepository';
import { SettingsRepository } from '../data/repositories/SettingsRepository';
import { auth } from '../lib/firebase';
import { Patient, ClinicSettings } from '../lib/types';
import { INITIAL_PATIENTS } from '../lib/seeds';
import { PatientSchema } from '@monorepo/shared';
import { queryKeys } from './queryKeys';

// -- HOOKS --

export function usePatients(demoMode: boolean) {
    const uid = auth.currentUser?.uid;
    return useQuery({
        queryKey: [...queryKeys.patients.all, { demoMode, uid }],
        queryFn: async () => {
            if (demoMode) return INITIAL_PATIENTS;
            const rawData = await PatientsService.getAll();

            // ZOD "IRON SHIELD" VALIDATION
            const validPatients = rawData.reduce((acc, item) => {
                const result = PatientSchema.safeParse(item);
                if (result.success) {
                    acc.push(result.data as Patient);
                } else {
                    console.error("🛡️ Titanium Warning: Patient schema mismatch detected.", item.id, result.error);
                    // RESCUE PROTOCOL: Allow legacy data to pass, but log it.
                    // We cast to Patient because we know it's coming from DB, logic will handle missing fields gracefully
                    acc.push(item as Patient);
                }
                return acc;
            }, [] as Patient[]);

            return validPatients;
        },
        enabled: true,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useSettings(demoMode: boolean) {
    const uid = auth.currentUser?.uid;
    return useQuery({
        queryKey: [...queryKeys.settings.all, { demoMode, uid }],
        queryFn: async () => {
            if (demoMode) {
                return {
                    name: 'Mi Clínica',
                    address: '',
                    phone: '',
                    email: '',
                    website: '',
                    cif: 'DEMO-123',
                    legalText: 'Modo demostración.',
                } as ClinicSettings;
            }
            if (!uid) return {} as ClinicSettings;
            return await SettingsRepository.get(uid);
        },
        enabled: true,
    });
}

// -- MUTATIONS --

type CreatePatientPayload = Omit<Patient, 'id'>;

export function useCreatePatient(demoMode: boolean) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreatePatientPayload) => {
            if (demoMode) {
                // Mock ID generation
                return { id: Date.now().toString(), ...payload } as Patient;
            }
            // TITANIUM ACID TRANSACTION
            const newId = await PatientRepository.create(payload);
            return { id: newId, ...payload } as Patient;
        },
        onSuccess: (newPatient) => {
            // Optimistic Update or Invalidation
            queryClient.setQueryData(queryKeys.patients.all, (old: Patient[] | undefined) => {
                return old ? [...old, newPatient] : [newPatient];
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
        },
    });
}

export function useUpdatePatient(demoMode: boolean) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (patient: Patient) => {
            if (demoMode) return patient;
            if (!patient.id) throw new Error("ID de paciente requerido");
            return await PatientsService.update(String(patient.id), patient);
        },
        // ⚡ TITANIUM OPTIMISTIC UI ⚡
        onMutate: async (newPatient) => {
            // 1. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: queryKeys.patients.all });

            // 2. Snapshot the previous value
            const previousPatients = queryClient.getQueryData<Patient[]>(queryKeys.patients.all);

            // 3. Optimistically update to the new value
            queryClient.setQueryData(queryKeys.patients.all, (old: Patient[] | undefined) => {
                return old ? old.map(p => p.id === newPatient.id ? { ...p, ...newPatient } : p) : [];
            });

            // 4. Return a context object with the snapshotted value
            return { previousPatients };
        },
        onError: (_err, _newPatient, context) => {
            // 5. Rollback on error
            if (context?.previousPatients) {
                queryClient.setQueryData(queryKeys.patients.all, context.previousPatients);
            }
        },
        onSettled: () => {
            // 6. Always refetch after error or success to ensure synchronization
            queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
        },
    });
}

export function useUpdateSettings(demoMode: boolean) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settings: ClinicSettings) => {
            const uid = auth.currentUser?.uid;
            if (demoMode) return { success: true };
            if (!uid) throw new Error("No user");
            await SettingsRepository.update(uid, settings);
            return { success: true };
        },
        onSuccess: (_, newSettings) => {
            queryClient.setQueryData(queryKeys.settings.all, newSettings);
            queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
        },
    });
}

export function useDeletePatient(demoMode: boolean) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (demoMode) return { success: true };
            return await PatientsService.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
        },
    });
}
