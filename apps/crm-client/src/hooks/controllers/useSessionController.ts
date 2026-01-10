import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SessionRepository } from '../../data/repositories/SessionRepository';
import { queryKeys } from '../../api/queryKeys';
import { useAuth } from '../../context/AuthContext';
import { Session, Patient } from '../../lib/types';
import { useActivityLog } from '../useActivityLog';
import { useUpdateSession } from '../../api/mutations/useSessionMutations';

export const useSessionController = (dateRange?: { start: string; end: string }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const { logActivity } = useActivityLog();
    const userId = user?.uid;

    // --- READ (Global Calendar) ---
    const {
        data: sessions = [],
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: userId && dateRange ? ['sessions', 'range', dateRange.start, dateRange.end] : [],
        queryFn: async () => {
            if (!userId || !dateRange) throw new Error("Missing params");
            return await SessionRepository.getSessionsByDateRange(dateRange.start, dateRange.end);
        },
        enabled: !!userId && !!dateRange,
        retry: false // Fail fast if index missing
    });

    // --- READ (Group History) ---
    const {
        data: groupHistory = [],
        isLoading: isLoadingHistory
    } = useQuery({
        queryKey: ['sessions', 'groups', 'history'],
        queryFn: async () => {
            if (!userId) return [];
            return await SessionRepository.getAllGroupSessions();
        },
        enabled: !!userId,
    });

    // --- WRITE ---
    const createMutation = useMutation({
        mutationFn: async (payload: { patientId: string; session: Omit<Session, 'id'> }) => {
            return await SessionRepository.create(payload.patientId, {
                id: Date.now(),
                ...payload.session,
                billable: true,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
            logActivity('session', 'Sesión creada');
        }
    });

    // TITANIUM: Use Centralized Optimistic Mutation
    const { mutateAsync: updateSession } = useUpdateSession();

    // --- MIGRATION (Admin Tool) ---
    const migrateMutation = useMutation({
        mutationFn: async (patient: Patient) => {
            return await SessionRepository.migratePatientSessions(patient);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
            logActivity('system', 'Migración de sesiones completada');
        }
    });

    return {
        sessions,
        isLoading,
        isError,
        error,
        createSession: createMutation.mutateAsync,
        updateSession,
        migrateSessions: migrateMutation.mutateAsync,
        groupHistory,
        isLoadingHistory
    };
};
