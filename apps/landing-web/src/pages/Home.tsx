import { useState } from 'react';
import { BookOpen, HeartPulse, GraduationCap, X } from 'lucide-react';
import { Navigation } from '../components/layout/Navigation';
import { Hero } from '../components/landing/Hero';
import { Methodology } from '../components/landing/Methodology';
import { Services } from '../components/landing/Services';
import { Software } from '../components/landing/Software';
import { FAQ } from '../components/landing/FAQ';
import { Testimonials } from '../components/landing/Testimonials';
import { About } from '../components/landing/About';
import { Footer } from '../components/landing/Footer';
const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Activa Musicoterapia",
    "alternateName": "Método Activa",
    "url": "https://activamusicoterapia.com",
    "logo": "https://activamusicoterapia.com/logo-premium.png",
    "description": "Centro líder en Neuro-Rehabilitación y Musicoterapia. Especialistas en Alzheimer, Autismo y Daño Cerebral Adquirido.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Calle de la Innovación 12",
        "addressLocality": "Madrid",
        "postalCode": "28010",
        "addressCountry": "ES"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 40.4168,
        "longitude": -3.7038
    },
    "telephone": "+34910000000",
    "priceRange": "$$",
    "medicalSpecialty": [
        "Neurology",
        "Psychiatry",
        "Rehabilitation",
        "Geriatrics"
    ],
    "availableService": [
        {
            "@type": "MedicalTherapy",
            "name": "Musicoterapia Neurológica",
            "description": "Tratamiento basado en evidencia para recuperación cognitiva y motora."
        },
        {
            "@type": "MedicalTherapy",
            "name": "Rehabilitación Alzheimer",
            "description": "Estimulación cognitiva avanzada para frenar el deterioro."
        }
    ],
    "sameAs": [
        "https://www.linkedin.com/company/activamusicoterapia",
        "https://www.instagram.com/activamusicoterapia"
    ],
    "founder": {
        "@type": "Person",
        "name": "Aurora Del Río",
        "jobTitle": "Directora Clínica",
        "image": "https://activamusicoterapia.com/assets/aurora-profile.jpg",
        "description": "Musicoterapeuta Neurológica con más de 20 años de experiencia.",
        "alumniOf": "Máster Europeo de Musicoterapia"
    }
};

return (
    <>
        <SeoHead schema={schema} />
        <Preloader onComplete={() => setShowContent(true)} />
        <div className={`font-['Inter'] antialiased selection:bg-[#EC008C] selection:text-white bg-[#F9FAFB] text-[#0A0F1D] transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>

            {/* MODAL COMPONENT */}
            {activeModal && modalConfig[activeModal] && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay font-['Inter']">
                    <div className="absolute inset-0 bg-[#0A0F1D]/60 backdrop-blur-xl transition-opacity" onClick={closeModal}></div>
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden modal-content border border-white/20 ring-1 ring-black/5 transform transition-all scale-100">
                        <div className="bg-white/80 p-8 border-b border-gray-100 flex justify-between items-center backdrop-blur-md z-20 relative sticky top-0">
                            <div className="flex items-center gap-5">
                                <div className="bg-[#FDF2F8] p-3.5 rounded-2xl shadow-sm border border-[#EC008C]/10 text-[#EC008C]">
                                    {modalConfig[activeModal].icon}
                                </div>
                                <h3 className="font-['Outfit'] font-bold text-2xl text-[#0A0F1D] leading-none tracking-tight">{modalConfig[activeModal].title}</h3>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-[#0A0F1D] transition-colors p-2.5 rounded-full hover:bg-gray-50">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-8 max-h-[80vh] overflow-y-auto">
                            {modalConfig[activeModal].content}
                        </div>
                    </div>
                </div>
            )}

            <Navigation />

            <main className="relative flex flex-col justify-center min-h-[calc(100vh-96px)] pt-24 overflow-hidden">
                <Hero onOpenModal={openModal} />
                <Methodology onOpenModal={openModal} />
                <Services onOpenModal={openModal} />
                <Software onOpenModal={openModal} />
                <FAQ />
                <Testimonials />
                <About />
            </main>

            <Footer />
        </div>
    </>
);
};

export default Home;
