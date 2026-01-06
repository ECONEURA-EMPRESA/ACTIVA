import { useState, useEffect } from 'react';
import { Activity, Menu, X, User } from 'lucide-react';
import logoPremium from '../../assets/images/logo-premium.png';

const LoginButton = () => (
    <a
        href="https://app.activamusicoterapia.com"
        target="_self"
        className="hidden md:flex h-12 px-8 items-center justify-center rounded-full bg-[#0A0F1D] text-white text-sm font-['Outfit'] font-bold hover:bg-[#3B82F6] transition-all shadow-xl shadow-[#0A0F1D]/20 gap-2.5 hover:-translate-y-1 active:scale-95 duration-300 border border-transparent ring-1 ring-white/10"
    >
        <User size={18} strokeWidth={2.5} />
        Login CRM
    </a>
);

export const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Clínica', href: '#clinica' },
        { name: 'Academia', href: '#academia' },
        { name: 'Software', href: '#software' },
        { name: 'FAQ', href: '#faq' },
        { name: 'Nosotros', href: '#nosotros' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled ? 'bg-white/90 backdrop-blur-2xl shadow-sm py-4' : 'bg-transparent py-8'}`}>
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_-5px_#EC008C] ring-2 ring-[#EC008C]/30 relative overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_30px_-5px_#EC008C] group-hover:ring-[#EC008C]/50">
                            <img src={logoPremium} alt="Logotipo Oficial Activa Musicoterapia - Clínica de Neurorehabilitación" className="w-[105%] h-auto object-contain drop-shadow-[0_2px_4px_rgba(236,0,140,0.4)]" />
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-12 bg-white/50 px-8 py-3 rounded-full border border-white/40 backdrop-blur-md shadow-sm">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="relative text-sm font-['Inter'] font-medium text-[#64748B] hover:text-[#0A0F1D] transition-colors py-2 group">
                                {link.name}
                                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#EC008C] transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full opacity-0 group-hover:opacity-100"></span>
                            </a>
                        ))}
                    </div>

                    {/* CTA & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <LoginButton />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden flex items-center justify-center w-12 h-12 text-[#0A0F1D] bg-white rounded-2xl hover:bg-gray-50 border border-gray-200 transition-colors active:scale-95"
                            aria-label="Abrir menú"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-100 absolute w-full shadow-2xl h-screen z-40 top-[80px]">
                    <div className="px-8 pt-8 pb-12 space-y-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="block text-3xl font-['Outfit'] font-bold text-[#0A0F1D] hover:text-[#EC008C] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="pt-10 border-t border-gray-100">
                            <a href="https://app.activamusicoterapia.com" className="w-full bg-[#0A0F1D] text-white py-6 rounded-3xl font-['Outfit'] font-bold text-xl shadow-xl shadow-[#0A0F1D]/20 flex items-center justify-center gap-3 active:scale-95 transition-transform">
                                <User size={24} />
                                Login CRM ACTIVA
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};
