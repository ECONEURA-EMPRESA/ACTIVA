import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SessionRepository } from '../../data/repositories/SessionRepository';
import { Session, Patient } from '../../lib/types';
import { queryKeys } from '../queryKeys';

export function useUpdateSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { patientId: string; sessionId: string; data: Partial<Session> }) => {
            await SessionRepository.update(payload.patientId, payload.sessionId, payload.data);
            return payload;
        },
        // ⚡ TITANIUM OPTIMISTIC UI ⚡
        onMutate: async (newSessionPayload) => {
            // 1. Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.patients.all });

            // 2. Snapshot
            const previousPatients = queryClient.getQueryData<Patient[]>(queryKeys.patients.all);

            // 3. Optimistic Update
            queryClient.setQueryData(queryKeys.patients.all, (old: Patient[] | undefined) => {
                if (!old) return [];
                return old.map(patient => {
                    if (String(patient.id) === String(newSessionPayload.patientId)) {
                        const updatedSessions = (patient.sessions || []).map(session => {
                            if (String(session.id) === String(newSessionPayload.sessionId)) {
                                return { ...session, ...newSessionPayload.data };
                            }
                            return session;
                        });
                        return { ...patient, sessions: updatedSessions };
                    }
                    return patient;
                });
            });

            return { previousPatients };
        },
        onError: (_err, _newSession, context) => {
            // 4. Rollback
            if (context?.previousPatients) {
                queryClient.setQueryData(queryKeys.patients.all, context.previousPatients);
            }
        },
        onSettled: () => {
            // 5. Sync
            queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
        },
    });
}

export function useCreateSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { patientId: string; session: Omit<Session, 'id'> }) => {
            // Generate ID client-side if needed for consistency check, but repository handles it too.
            // We trust repository to return the ID or use the one we pass if we generated it.
            // For optimistic, we need an ID.
            const tempId = Date.now().toString();
            const sessionWithId = { ...payload.session, id: tempId };
            await SessionRepository.create(payload.patientId, sessionWithId);
            return { ...sessionWithId, patientId: payload.patientId };
        },
        onMutate: async (newSessionPayload) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.patients.all });
            const previousPatients = queryClient.getQueryData<Patient[]>(queryKeys.patients.all);

            const tempId = Date.now().toString();
            const optimisitcSession = { ...newSessionPayload.session, id: tempId };

            queryClient.setQueryData(queryKeys.patients.all, (old: Patient[] | undefined) => {
                if (!old) return [];
                return old.map(patient => {
                    if (String(patient.id) === String(newSessionPayload.patientId)) {
                        return {
                            ...patient,
                            sessions: [optimisitcSession as Session, ...(patient.sessions || [])]
                        };
                    }
                    return patient;
                });
            });

            return { previousPatients };
        },
        onError: (_err, _newSession, context) => {
            if (context?.previousPatients) {
                queryClient.setQueryData(queryKeys.patients.all, context.previousPatients);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
        }
    });
}

export function useDeleteSession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { patientId: string; sessionId: string }) => {
            await SessionRepository.delete(payload.patientId, payload.sessionId);
            return payload;
        },
        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.patients.all });
            const previousPatients = queryClient.getQueryData<Patient[]>(queryKeys.patients.all);

            queryClient.setQueryData(queryKeys.patients.all, (old: Patient[] | undefined) => {
                if (!old) return [];
                return old.map(patient => {
                    if (String(patient.id) === String(payload.patientId)) {
                        return {
                            ...patient,
                            sessions: (patient.sessions || []).filter(s => String(s.id) !== String(payload.sessionId))
                        };
                    }
                    return patient;
                });
            });

            return { previousPatients };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousPatients) {
                queryClient.setQueryData(queryKeys.patients.all, context.previousPatients);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
        }
    });
}
