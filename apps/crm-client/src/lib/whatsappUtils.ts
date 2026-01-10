/**
 * TITANIUM WHATSAPP CONNECTOR
 * Standardizes all WhatsApp Business interactions across the entire CRM.
 */

export const WhatsApp = {
    /**
     * Generates a universal WhatsApp API link.
     * Handles cleaning of spaces, dashes, and ensures international format.
     */
    generateLink: (phone: string | undefined, message?: string) => {
        if (!phone) return '#';

        // 1. Sanitize: Remove all non-digit characters
        let cleanPhone = phone.replace(/\D/g, '');

        // 2. International Enforcement (Titanium Standard)
        // If the number doesn't start with a country code (approx len check), add Spanish prefix default
        // Assuming most local numbers are 9 digits.
        if (cleanPhone.length === 9) {
            cleanPhone = `34${cleanPhone}`;
        }

        const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';

        // 3. Use universal shortlink
        return `https://wa.me/${cleanPhone}${encodedMessage}`;
    },

    /**
     * Opens the WhatsApp chat in a new tab.
     */
    openChat: (phone: string | undefined, message?: string) => {
        if (!phone) {
            alert('Número de teléfono no disponible');
            return;
        }
        const link = WhatsApp.generateLink(phone, message);
        window.open(link, '_blank');
    }
};
