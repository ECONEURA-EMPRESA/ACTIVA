import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { es } from './locales/es';
import { en } from './locales/en';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            es,
            en // Keep structure but we effectively ignore it by forcing 'es'
        },
        lng: 'es', // FORCE SPANISH ALWAYS
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false // React runs XSS safe
        },
    });

export default i18n;
