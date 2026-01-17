import { useCallback } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ActivityLogItem {
    id: string;
    type: 'patient' | 'settings' | 'session' | 'system' | 'report' | 'finance' | 'security' | 'delete';
    message: string;
    timestamp: string;
    userId: string;
}

export const useActivityLog = () => {
    const queryClient = useQueryClient();
    const userId = auth.currentUser?.uid;

    // FETCH LOGS (Read-Only from DB)
    const { data: activities = [], isLoading: isQueryLoading, refetch } = useQuery({
        queryKey: ['activity_logs', userId],
        queryFn: async () => {
            if (!userId) return [];

            // TITANIUM FALLBACK: Fetch all logs for user and sort in memory.
            const q = query(
                collection(db, 'activity_logs'),
                where('userId', '==', userId)
            );

            try {
                const snapshot = await getDocs(q);
                // In-Memory Sort & Limit (Safe for < 1000 items)
                return snapshot.docs
                    .map(d => ({ id: d.id, ...d.data() } as ActivityLogItem))
                    .filter(item => item.timestamp && !isNaN(new Date(item.timestamp).getTime())) // Filter invalid dates
                    .sort((a, b) => {
                        const dateA = new Date(a.timestamp).getTime();
                        const dateB = new Date(b.timestamp).getTime();
                        return dateB - dateA;
                    })
                    .slice(0, 50);
            } catch (err) {
                console.error("Activity Log Query Failed:", err);
                return [];
            }
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // Cache for 5 mins
    });

    // APPEND LOG (Write-Only to DB)
    const logMutation = useMutation({
        mutationFn: async (payload: { type: ActivityLogItem['type']; message: string }) => {
            if (!userId) return;
            await addDoc(collection(db, 'activity_logs'), {
                type: payload.type,
                message: payload.message,
                timestamp: new Date().toISOString(),
                userId
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activity_logs'] });
        }
    });

    const logActivity = useCallback((type: ActivityLogItem['type'], message: string) => {
        // Fire and forget (optimistic UI could be improved later)
        logMutation.mutate({ type, message });
    }, [logMutation]);

    return {
        activities,
        logActivity,
        latestActivities: activities.slice(0, 4),
        isLoading: logMutation.isPending || isQueryLoading,
        refetch
    };
};
