import { Instagram, Facebook, Mail } from 'lucide-react';
import logoPremium from '../../assets/images/logo-premium.png';

export const Footer = () => {
    return (
        <footer id="footer" className="bg-[#0A0F1D] text-white border-t border-white/5 py-24 px-6 lg:px-12 text-center">
            <div className="max-w-[960px] mx-auto flex flex-col gap-12">
                <div className="flex flex-col items-center gap-8">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_-5px_#EC008C] ring-2 ring-[#EC008C]/30 relative overflow-hidden group">
                        <img src={logoPremium} alt="Logotipo Oficial Activa Musicoterapia - Ciencia y Salud" className="w-[105%] h-auto object-contain drop-shadow-[0_2px_4px_rgba(236,0,140,0.4)] group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:animate-shine"></div>
                    </div>
                    <p className="text-gray-400 text-lg font-['Inter'] max-w-lg mx-auto font-light leading-relaxed">Activa Musicoterapia combina la ciencia, la música y la tecnología para mejorar la calidad de vida.</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 border-y border-white/5 py-10">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors font-['Outfit'] font-medium text-sm tracking-wide hover:underline">Aviso de Privacidad</a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors font-['Outfit'] font-medium text-sm tracking-wide hover:underline">Términos y Condiciones</a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors font-['Outfit'] font-medium text-sm tracking-wide hover:underline">Mapa del Sitio</a>
                </div>
                <div className="flex justify-center gap-8">
                    <a href="#" className="bg-white/5 hover:bg-[#EC008C] p-4 rounded-full text-white transition-colors transform hover:scale-110 duration-300 border border-white/5"><Instagram size={24} /></a>
                    <a href="#" className="bg-white/5 hover:bg-[#3B82F6] p-4 rounded-full text-white transition-colors transform hover:scale-110 duration-300 border border-white/5"><Facebook size={24} /></a>
                    <a href="#" className="bg-white/5 hover:bg-white hover:text-[#0A0F1D] p-4 rounded-full text-white transition-colors transform hover:scale-110 duration-300 border border-white/5"><Mail size={24} /></a>
                </div>
                <div className="text-gray-600 text-sm font-['Inter'] w-full mt-4">
                    <p>© 2026 Activa Musicoterapia. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};
