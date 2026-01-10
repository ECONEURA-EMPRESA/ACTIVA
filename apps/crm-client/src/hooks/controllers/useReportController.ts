import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReportRepository } from '../../data/repositories/ReportRepository'; // Ensure this matches filename
import { queryKeys } from '../../api/queryKeys';
import { useActivityLog } from '../useActivityLog';
import { ClinicalReport } from '../../lib/types';

export const useReportController = (patientId?: string) => {
    const queryClient = useQueryClient();
    const { logActivity } = useActivityLog();

    // --- READS ---
    const {
        data: reports = [],
        isLoading,
        isError,
        error
    } = useQuery({
        // Dynamic Key: If patientId provided, fetch specific. Else fetch global.
        queryKey: patientId ? queryKeys.reports.byPatient(patientId) : queryKeys.reports.all,
        queryFn: async () => {
            if (patientId) {
                return await ReportRepository.getByPatientId(patientId);
            } else {
                return await ReportRepository.getAllGlobal();
            }
        },
        retry: 1 // Don't retry too much if index is missing
    });

    // --- WRITES ---
    const createReportMutation = useMutation({
        mutationFn: async (report: Omit<ClinicalReport, 'id'>) => {
            return await ReportRepository.create(report);
        },
        onSuccess: (data) => {
            // Invalidate both global and specific queries
            queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
            if (data.patientId) {
                queryClient.invalidateQueries({ queryKey: queryKeys.reports.byPatient(data.patientId) });
            }
            logActivity('report', `Informe creado: ${data.type}`);
        }
    });

    return {
        reports,
        isLoading,
        isError,
        error, // Expose strict error to check for 'failed-precondition'
        createReport: createReportMutation.mutateAsync,
        isCreating: createReportMutation.isPending
    };
};
