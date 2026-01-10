import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InvoiceRepository } from '../../data/repositories/InvoiceRepository';
import { BillingRepository, BillableSessionRef } from '../../data/repositories/BillingRepository';
import { Invoice } from '@monorepo/shared';

import { useActivityLog } from '../useActivityLog';

export const useInvoiceController = () => {
    const queryClient = useQueryClient();
    const { logActivity } = useActivityLog();

    const invoicesQuery = useQuery({
        queryKey: ['invoices'],
        queryFn: () => InvoiceRepository.getAll(),
        staleTime: 1000 * 60 * 5 // 5 min
    });



    const createMutation = useMutation({
        mutationFn: (params: { invoice: Invoice, sessions: BillableSessionRef[] }) =>
            BillingRepository.createInvoiceBatch(params.invoice, params.sessions),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            queryClient.invalidateQueries({ queryKey: ['sessions'] }); // Refresh sessions to show paid status
            logActivity('finance', `Nueva factura creada: ${variables.invoice.number} (${variables.invoice.total}€)`);
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: (params: { id: string, status: Invoice['status'], paidAt?: string, method?: string }) =>
            InvoiceRepository.updateStatus(params.id, params.status, params.paidAt, params.method),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            if (variables.status === 'PAID') {
                logActivity('finance', `Factura cobrada: ${variables.id} (Método: ${variables.method || 'N/A'})`);
            } else {
                logActivity('finance', `Factura actualizada: ${variables.id} -> ${variables.status}`);
            }
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => InvoiceRepository.delete(id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['invoices'] });
            logActivity('delete', `Factura eliminada: ${variables}`);
        }
    });

    return {
        invoices: invoicesQuery.data || [],
        isLoading: invoicesQuery.isLoading,
        error: invoicesQuery.error,
        createInvoice: createMutation.mutateAsync,
        updateStatus: updateStatusMutation.mutateAsync,
        deleteInvoice: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateStatusMutation.isPending
    };
};
