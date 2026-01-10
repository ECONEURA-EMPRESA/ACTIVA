import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes (Titanium Standard: Low Volatility by Default)
            gcTime: 1000 * 60 * 30, // 30 minutes
            retry: 1, // Fail fast, don't hang the UI
            refetchOnWindowFocus: false, // Save Firebase reads
            networkMode: 'offlineFirst',
        },
        mutations: {
            networkMode: 'offlineFirst',
            retry: 0, // Mutations should not retry automatically by default (risk of double-writes if not idempotent)
        },
    },
});
