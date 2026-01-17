import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentRepository } from '../../data/repositories/DocumentRepository';
import { queryKeys } from '../../api/queryKeys';
import { useActivityLog } from '../useActivityLog';
// import { toast } from 'react-hot-toast'; // Titanium Standard Feedback - TODO: Install/Configure

export const useDocumentController = (patientId?: string) => {
    const queryClient = useQueryClient();
    const { logActivity } = useActivityLog();

    // --- READS ---
    const {
        data: documents = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: patientId ? queryKeys.patients.documents(patientId) : [],
        queryFn: async () => {
            if (!patientId) throw new Error("Patient ID required");
            return await DocumentRepository.getByPatientId(patientId);
        },
        enabled: !!patientId,
    });

    // --- WRITES (COMMANDS) ---

    // Upload Command
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            if (!patientId) throw new Error("No patient selected");
            // Pre-flight Validation (Controller level)
            if (file.size > 10 * 1024 * 1024) throw new Error("El archivo excede 10MB");

            return await DocumentRepository.upload(patientId, file);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.patients.documents(patientId!) });
            logActivity('report', `Documento subido: ${data.name} `);

        },
        onError: (err) => {
            console.error('Upload Failed:', err);
            console.error(err instanceof Error ? err.message : 'Error al subir archivo');
        }
    });

    // Delete Command
    const deleteMutation = useMutation({
        mutationFn: async (document: { path: string; type: string; id: string; url: string; name: string; size: number; createdAt: string }) => {
            if (!patientId) throw new Error("No patient selected");
            return await DocumentRepository.delete(patientId, document);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.patients.documents(patientId!) });
            logActivity('delete', 'Documento eliminado');

        },
        onError: (err) => {
            console.error('Delete Failed:', err);
            console.error('Error al eliminar archivo');
        }
    });

    return {
        documents,
        isLoading,
        isError,
        uploadDocument: uploadMutation.mutateAsync,
        isUploading: uploadMutation.isPending,
        deleteDocument: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending
    };
};
