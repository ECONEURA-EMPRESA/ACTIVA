import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import './i18n';
import './index.css';

import { ReloadPrompt } from './ReloadPrompt';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { BrowserRouter } from 'react-router-dom';
import { queryClient, persister } from '@/lib/react-query';

// Auto-update PWA - Managed by ReloadPrompt & VitePWA
// TITANIUM: KILL SWITCH REMOVED. MOBILE APP ENABLED.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 * 7 }} // 7 Days Persistence (Mobile App Standard)
    >
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </PersistQueryClientProvider>
    <ReloadPrompt />
  </React.StrictMode>,
);
