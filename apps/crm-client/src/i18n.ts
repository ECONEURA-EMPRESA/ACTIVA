import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Resources for MVP (English / Spanish)
const resources = {
    en: {
        translation: {
            "app": {
                "title": "Método Activa CRM"
            },
            "login": {
                "title": "Professional Access",
                "subtitle": "Clinical Management Platform",
                "email": "Email Address",
                "password": "Password",
                "button": "Enter System",
                "demo": "Demo / Audit Access",
                "register": "Professional Registration"
            },
            "dashboard": {
                "welcome": "Welcome back",
                "patients": "Active Patients",
                "sessions": "Weekly Sessions",
                "alerts": "Clinical Alerts"
            }
        }
    },
    es: {
        translation: {
            "app": {
                "title": "Método Activa CRM"
            },
            "login": {
                "title": "Acceso Profesional",
                "subtitle": "Plataforma de Gestión Clínica",
                "email": "Correo Electrónico",
                "password": "Tu Contraseña",
                "button": "Entrar al Sistema",
                "demo": "Acceso Demo / Auditoría",
                "register": "Registro Profesional"
            },
            "dashboard": {
                "welcome": "Bienvenido de nuevo",
                "patients": "Pacientes Activos",
                "sessions": "Sesiones Semana",
                "alerts": "Alertas Clínicas"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false // React runs XSS safe
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
