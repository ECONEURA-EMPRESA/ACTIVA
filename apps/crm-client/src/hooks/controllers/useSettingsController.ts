import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsRepository } from '../../data/repositories/SettingsRepository';
import { queryKeys } from '../../api/queryKeys';
import { useAuth } from '../../context/AuthContext';
import { ClinicSettings } from '../../lib/types';
import { useActivityLog } from '../useActivityLog';

export const useSettingsController = () => {
    const { user } = useAuth(); // Assuming useAuth gives us the current user
    const queryClient = useQueryClient();
    const { logActivity } = useActivityLog();

    // Guard: Ensure user is loaded
    const userId = user?.uid;

    // --- READ ---
    const {
        data: settings,
        isLoading,
        isError
    } = useQuery({
        queryKey: userId ? queryKeys.settings.all : [], // Using generic key for now, ideally specific
        queryFn: async () => {
            if (!userId) throw new Error("No User");
            return await SettingsRepository.get(userId);
        },
        enabled: !!userId,
    });

    // --- WRITE ---
    const updateMutation = useMutation({
        mutationFn: async (newSettings: Partial<ClinicSettings>) => {
            if (!userId) throw new Error("No User");
            // Titanium Standard: Validation could happen here or in form
            return await SettingsRepository.update(userId, newSettings);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
            logActivity('settings', 'Configuración actualizada');
        }
    });

    return {
        settings,
        isLoading,
        isError,
        updateSettings: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending
    };
};
