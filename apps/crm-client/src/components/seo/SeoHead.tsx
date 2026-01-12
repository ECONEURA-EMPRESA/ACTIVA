import React, { useEffect } from 'react';

interface SeoHeadProps {
    title: string;
    description?: string;
    image?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
    title,
    description = 'Plataforma Clínica de Neuro-Rehabilitación Método Activa.',
    image = '/icon.svg'
}) => {
    useEffect(() => {
        // Basic Title
        document.title = `${title} | Método Activa`;

        // Meta Tags Management
        const setMeta = (name: string, content: string) => {
            let element = document.querySelector(`meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        const setOg = (property: string, content: string) => {
            let element = document.querySelector(`meta[property="${property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', property);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Apply Metadata
        setMeta('description', description);
        setMeta('theme-color', '#EC008C'); // TITANIUM BRAND COLOR

        // Open Graph
        setOg('og:title', `${title} | Método Activa`);
        setOg('og:description', description);
        setOg('og:image', window.location.origin + image);
        setOg('og:type', 'website');

    }, [title, description, image]);

    return null;
};
