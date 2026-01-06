import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './i18n';
import './index.css';
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';
import { ReloadPrompt } from './ReloadPrompt';

// Auto-update PWA
registerSW({ immediate: true });

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'offlineFirst',
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
    <ReloadPrompt />
  </React.StrictMode>,
);
