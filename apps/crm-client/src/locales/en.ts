import { es } from './es';

// Type-check: EN must match structure of ES (Partial in practice, but ideally complete)
export const en: typeof es = {
    translation: {
        sidebar: {
            brand: {
                enterprise: "ENTERPRISE"
            },
            nav: {
                dashboard: "Dashboard",
                patients: {
                    section: "PATIENTS",
                    all: "All Patients",
                    adults: "Adults",
                    kids: "Children"
                },
                management: {
                    section: "MANAGEMENT",
                    individual: "Individual",
                    group: "Group",
                    calendar: "Calendar"
                },
                tools: {
                    section: "TOOLS",
                    resources: "Resources",
                    settings: "Settings"
                }
            },
            pwa: {
                install_short: "App",
                install_long: "Install App",
                download: "Download App"
            },
            user: {
                verified: "VERIFIED"
            }
        }
    }
};
