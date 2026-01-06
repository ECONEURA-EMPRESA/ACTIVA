import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    schema?: Record<string, any>;
}

export const SeoHead = ({
    title = 'Activa Musicoterapia | Clínica de Neuro-Rehabilitación',
    description = 'Primera clínica de musicoterapia basada en evidencia para Alzheimer, Autismo y Daño Cerebral. Telemedicina Global y Atención Presencial.',
    keywords = 'musicoterapia, alzheimer, autismo, neurorehabilitación, terapia online, activa musicoterapia',
    image = '/logo-premium.png',
    url = 'https://activamusicoterapia.com',
    schema
}: SeoHeadProps) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Canonical */}
            <link rel="canonical" href={url} />

            {/* JSON-LD Schema */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};
