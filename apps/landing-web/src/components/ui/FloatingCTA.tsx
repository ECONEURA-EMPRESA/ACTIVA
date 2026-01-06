import { MessageCircle } from 'lucide-react';

export const FloatingCTA = () => (
    <a href="#" className="fixed bottom-8 right-8 z-50 bg-[#25D366]/90 backdrop-blur-xl text-white p-5 rounded-full shadow-[0_20px_40px_-10px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-500 group flex items-center gap-0 hover:gap-3 overflow-hidden border border-white/20">
        <MessageCircle size={28} strokeWidth={2} />
        <span className="max-w-0 group-hover:max-w-xs transition-all duration-500 font-['Outfit'] font-bold whitespace-nowrap overflow-hidden text-sm">Chat Médico</span>
    </a>
);
