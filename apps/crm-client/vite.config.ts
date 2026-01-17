/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['**/*.test.{ts,tsx}'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // TITANIUM: User controls updates (Safe Mode)
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'ACTIVA MUSICOTERAPIA',
        short_name: 'ACTIVA',
        description: 'Plataforma clínica especializada en Musicoterapia y Neuro-rehabilitación.',
        theme_color: '#EC008C',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['medical', 'productivity', 'health'],
        lang: 'es',
        start_url: '/',
        id: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: "screenshot-clinic-1.jpg",
            sizes: "1290x2796",
            type: "image/jpeg",
            form_factor: "narrow",
            label: "Gestión de Pacientes"
          },
          {
            src: "screenshot-clinic-2.jpg",
            sizes: "1290x2796",
            type: "image/jpeg",
            form_factor: "narrow",
            label: "Agenda Global"
          },
          {
            src: "screenshot-clinic-3.jpg",
            sizes: "1290x2796",
            type: "image/jpeg",
            form_factor: "narrow",
            label: "Facturación"
          },
          {
            src: "screenshot-clinic-4.jpg",
            sizes: "1290x2796",
            type: "image/jpeg",
            form_factor: "narrow",
            label: "Dashboard"
          }
        ],
        shortcuts: [
          {
            name: "Nuevo Paciente",
            url: "/patients?action=new",
            icons: [{ src: "pwa-192x192.png", sizes: "192x192" }]
          },
          {
            name: "Agenda",
            url: "/calendar",
            icons: [{ src: "pwa-192x192.png", sizes: "192x192" }]
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
      }
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  },
});

