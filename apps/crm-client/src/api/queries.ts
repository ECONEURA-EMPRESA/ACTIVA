import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PatientsService, SettingsService } from './services';
import { Patient, ClinicSettings } from '../lib/types';
import { INITIAL_PATIENTS } from '../lib/seeds';
import { PatientSchema } from '@monorepo/shared';

// KEYS
export const KEYS = {
    PATIENTS: ['patients'],
    SETTINGS: ['settings'],
};

// -- HOOKS --

export function usePatients(demoMode: boolean) {
    return useQuery({
        queryKey: KEYS.PATIENTS,
        queryFn: async () => {
            if (demoMode) return INITIAL_PATIENTS;
            const rawData = await PatientsService.getAll();

            // ZOD "IRON SHIELD" VALIDATION
            const validPatients = rawData.reduce((acc, item) => {
                const result = PatientSchema.safeParse(item);
                if (result.success) {
                    acc.push(result.data as Patient);
                } else {
                    console.warn("🛡️ Zod Shield: Blocked corrupt patient record:", item.id, result.error);
                }
                return acc;
            }, [] as Patient[]);

            return validPatients;
        },
        enabled: true,
    });
}

export function useSettings(demoMode: boolean) {
    return useQuery({
        queryKey: KEYS.SETTINGS,
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
            return await SettingsService.get();
        },
    });
}

// -- MUTATIONS --

export function useCreatePatient(demoMode: boolean) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: any) => {
            if (demoMode) {
                // Mock ID generation
                return { id: Date.now().toString(), ...payload } as Patient;
            }
            return await PatientsService.create(payload);
        },
        onSuccess: (newPatient) => {
            // Optimistic Update or Invalidation
            queryClient.setQueryData(KEYS.PATIENTS, (old: Patient[] | undefined) => {
                return old ? [...old, newPatient] : [newPatient];
            });
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
        onSuccess: (updatedPatient) => {
            queryClient.setQueryData(KEYS.PATIENTS, (old: Patient[] | undefined) => {
                return old ? old.map(p => p.id === updatedPatient.id ? updatedPatient : p) : [updatedPatient];
            });
        },
    });
}

export function useUpdateSettings(demoMode: boolean) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (settings: ClinicSettings) => {
            if (demoMode) return { success: true };
            return await SettingsService.save(settings);
        },
        onSuccess: (_, newSettings) => {
            queryClient.setQueryData(KEYS.SETTINGS, newSettings);
        },
    });
}
