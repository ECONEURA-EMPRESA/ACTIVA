import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NoteRepository, DailyNote, NoteItem } from '../../data/repositories/NoteRepository';

export const useNoteController = (dateStr: string) => {
    const queryClient = useQueryClient();

    // Fetch Note
    const { data: note, isLoading } = useQuery({
        queryKey: ['daily_note', dateStr],
        queryFn: () => NoteRepository.getByDate(dateStr),
        staleTime: 1000 * 60 * 5, // 5 mins
    });

    // Generic Mutation
    const mutation = useMutation({
        mutationFn: (data: Partial<DailyNote>) => NoteRepository.save(dateStr, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daily_note', dateStr] });
        }
    });

    // Helper: Add Item
    const addItem = async (text: string) => {
        if (!text.trim()) return;
        const newItem: NoteItem = {
            id: Date.now().toString(),
            text,
            isCompleted: false,
            createdAt: Date.now()
        };
        // Add to TOP of list
        const currentItems = note?.items || [];
        await mutation.mutateAsync({ items: [newItem, ...currentItems] });
    };

    // Helper: Update Item
    const updateItem = async (itemId: string, updates: Partial<NoteItem>) => {
        const currentItems = note?.items || [];
        const newItems = currentItems.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
        );
        await mutation.mutateAsync({ items: newItems });
    };

    // Helper: Delete Item
    const deleteItem = async (itemId: string) => {
        const currentItems = note?.items || [];
        const newItems = currentItems.filter(item => item.id !== itemId);
        await mutation.mutateAsync({ items: newItems });
    };

    // Delete Entire Daily Note
    const deleteMutation = useMutation({
        mutationFn: () => NoteRepository.delete(dateStr),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daily_note', dateStr] });
        }
    });

    return {
        note,
        items: note?.items || [],
        isLoading,
        saveNote: mutation.mutate, // For raw partial updates
        addItem,
        updateItem,
        deleteItem,
        deleteDailyNote: deleteMutation.mutateAsync,
        isSaving: mutation.isPending,
        isDeleting: deleteMutation.isPending
    };
};
