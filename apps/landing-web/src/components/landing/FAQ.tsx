import { RevealSection } from '../ui/RevealSection';

const faqs = [
    {
        question: "¿Qué es la Musicoterapia Clínica?",
        answer: "Es el uso profesional de la música y sus elementos (ritmo, melodía, armonía) por un musicoterapeuta cualificado para promover, mantener y restaurar la salud mental, física y emocional."
    },
    {
        question: "¿Para quién está indicado el Método Activa?",
        answer: "Especialmente efectivo en Trastornos del Espectro Autista (TEA), Alzheimer, Daño Cerebral Adquirido, TDAH y trastornos de ansiedad. Adaptamos el protocolo a cada neurotipo."
    },
    {
        question: "¿Necesito saber música para las sesiones?",
        answer: "No. El paciente no necesita conocimientos musicales previos. La música es el medio terapéutico, no el fin educativo."
    },
    {
        question: "¿Las sesiones son presenciales o online?",
        answer: "Ofrecemos ambas modalidades. Nuestra plataforma de Telemedicina permite realizar intervenciones efectivas a distancia con calidad HD y baja latencia."
    },
    {
        question: "¿Cómo puedo agendar una consulta?",
        answer: "Puedes reservar directamente desde nuestra web. Ofrecemos una primera consulta de valoración gratuita para determinar el plan de tratamiento ideal."
    }
];

export const FAQ = () => {
    return (
        <section id="faq" className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-[#EC008C] font-bold tracking-wider text-sm uppercase font-['Outfit']">Dudas Frecuentes</span>
                    <h2 className="text-4xl md:text-5xl font-['Outfit'] font-black text-[#0A0F1D]">
                        Preguntas <span className="text-[#EC008C]">Clínicas</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details key={index} className="group bg-slate-50 rounded-2xl border border-gray-100 open:bg-white open:shadow-xl open:border-[#EC008C]/20 transition-all duration-300">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-['Outfit'] font-bold text-[#0A0F1D] text-lg select-none">
                                {faq.question}
                                <span className="transform transition-transform duration-300 group-open:rotate-180 bg-white p-2 rounded-full shadow-sm text-[#EC008C]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-600 font-['Inter'] leading-relaxed animate-fadeIn">
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};
