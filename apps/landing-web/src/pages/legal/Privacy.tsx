import { Navigation } from '../../components/layout/Navigation';
import { Footer } from '../../components/landing/Footer';
import { SeoHead } from '../../components/shared/SeoHead';

export const Privacy = () => {
    return (
        <>
            <SeoHead title="Política de Privacidad | Activa Musicoterapia" />
            <Navigation />
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto font-['Inter']">
                <h1 className="text-4xl font-['Outfit'] font-bold mb-8 text-[#0A0F1D]">Política de Privacidad</h1>
                <div className="prose prose-lg max-w-none text-gray-600">
                    <p>Última actualización: Enero 2026</p>
                    <p>En Activa Musicoterapia, nos comprometemos a proteger la privacidad y seguridad de sus datos personales, especialmente los datos de salud protegidos (PHI/GDPR).</p>

                    <h3>1. Responsable del Tratamiento</h3>
                    <p>Activa Musicoterapia S.L. (en constitución)<br />
                        Dirección: Madrid, España<br />
                        Email: legal@activamusicoterapia.com</p>

                    <h3>2. Datos que Recopilamos</h3>
                    <ul>
                        <li>Datos de identificación (Nombre, Email, Teléfono)</li>
                        <li>Datos de salud (Motivo de consulta, Diagnóstico previo) - Solo bajo consentimiento explícito.</li>
                        <li>Datos técnicos (IP, Navegador) para seguridad y analítica.</li>
                    </ul>

                    <h3>3. Finalidad</h3>
                    <p>Gestionar la reserva de citas, prestar servicios de telemedicina y cumplir conobligaciones legales sanitarias.</p>
                </div>
            </main>
            <Footer />
        </>
    );
};
