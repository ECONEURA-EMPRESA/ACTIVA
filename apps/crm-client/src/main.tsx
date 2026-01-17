import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './i18n';
import './index.css';
// import { registerSW } from 'virtual:pwa-register';
import { ReloadPrompt } from './ReloadPrompt';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { BrowserRouter } from 'react-router-dom';
import { queryClient, persister } from '@/lib/react-query';

// Auto-update PWA
// TITANIUM: KILL SWITCH FOR SERVICE WORKERS
// This ensures the aggressive 365-day cache is nuked immediately.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {}).then(() => {
    // Registered
  });
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }} // 24 Hours Persistence
    >
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </PersistQueryClientProvider>
    <ReloadPrompt />
  </React.StrictMode>,
);
