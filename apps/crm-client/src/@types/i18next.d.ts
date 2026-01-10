import 'i18next';
import { es } from '../locales/es';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: typeof es;
    }
}
