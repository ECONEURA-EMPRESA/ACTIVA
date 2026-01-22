import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Briefcase, ChevronDown, UserPlus, BookOpen, Users, Activity, MonitorPlay, GraduationCap, LucideIcon } from 'lucide-react';
import logoPremium from '../../assets/images/logo-alpha.png';

const CRM_URL = 'https://app-activamusicoterapia.web.app/auth/login';
const REGISTER_URL = 'https://app-activamusicoterapia.web.app/auth/register';

// Premium Spotlight Dropdown
const NavDropdown = ({ title, items }: { title: string, items: { label: string, href: string, icon: LucideIcon }[] }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative group h-full flex items-center"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button className="flex items-center gap-1.5 px-5 py-2 text-sm font-['Outfit'] font-medium text-slate-600 group-hover:text-[#0A0F1D] transition-all duration-300 tracking-wide relative z-10">
                {title}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ease-out ${isOpen ? 'rotate-180 text-[#EC008C]' : 'text-slate-400'}`} />
                {/* Glow Element - Subtle Gray */}
                <div className="absolute inset-0 bg-gray-100 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </button>

            {/* Ultra-Premium Glass Menu - White */}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 p-2 bg-white/90 backdrop-blur-3xl border border-gray-100 rounded-2xl shadow-2xl transition-all duration-300 origin-top overflow-hidden ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-4 invisible'}`}>

                <div className="relative flex flex-col gap-1 z-10">
                    {items.map((item) => (
                        item.href.startsWith('#') ? (
                            <a
                                key={item.label}
                                href={item.href}
                                className="group/item flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-gray-100 relative overflow-hidden"
                            >
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-100 group-hover/item:border-[#EC008C]/30 group-hover/item:bg-[#EC008C]/5 transition-colors shadow-sm">
                                    <item.icon className="w-4 h-4 text-slate-400 group-hover/item:text-[#EC008C] transition-colors" />
                                </div>
                                <span className="text-sm font-['Outfit'] font-normal text-slate-600 group-hover/item:text-slate-900 tracking-wide">
                                    {item.label}
                                </span>
                            </a>
                        ) : (
                            <Link
                                key={item.label}
                                to={item.href}
                                viewTransition
                                className="group/item flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-gray-100 relative overflow-hidden"
                            >
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-gray-100 group-hover/item:border-[#EC008C]/30 group-hover/item:bg-[#EC008C]/5 transition-colors shadow-sm">
                                    <item.icon className="w-4 h-4 text-slate-400 group-hover/item:text-[#EC008C] transition-colors" />
                                </div>
                                <span className="text-sm font-['Outfit'] font-normal text-slate-600 group-hover/item:text-slate-900 tracking-wide">
                                    {item.label}
                                </span>
                            </Link>
                        )
                    ))}
                </div>
            </div>

            {/* Invisible bridge */}
            <div className={`absolute -bottom-6 left-0 w-full h-8 ${isOpen ? 'block' : 'hidden'}`}></div>
        </div>
    );
};

export const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const clinicaItems = [
        { label: 'Individual', href: '#individual', icon: Activity },
        { label: 'Grupal', href: '#grupal', icon: Users },
    ];

    const profesionalesItems = [
        { label: 'Libro', href: '#libro', icon: BookOpen },
        { label: 'Software Activa', href: '#software', icon: MonitorPlay },
        { label: 'Academia', href: '#academia', icon: GraduationCap },
    ];

    return (
        <header>
            <nav
                className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 transition-all duration-500 ease-in-out shadow-sm"
            >
                <div className="max-w-[1920px] mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-2 lg:grid-cols-12 items-center gap-4">

                        {/* LEFT: Logo Premium (Activa) */}
                        <div className="lg:col-span-2 flex items-center justify-start">
                            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                                {/* FORCED CIRCULAR FIT */}
                                <div className="relative w-[42px] h-[42px] rounded-full p-[1.5px] bg-gradient-to-tr from-[#EC008C] via-gray-200 to-cyan-400 shadow-md group-hover:shadow-lg transition-all duration-500">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden">
                                        <img src={logoPremium} alt="Activa Logo" className="w-full h-full object-cover rounded-full relative z-10 hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CENTER: Premium Glass Menu - White Pill */}
                        <div className="hidden lg:flex lg:col-span-6 items-center justify-center h-full">
                            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-slate-50 border border-gray-100 shadow-inner">
                                <NavDropdown title="CLÍNICA" items={clinicaItems} />
                                <NavDropdown title="PROFESIONALES" items={profesionalesItems} />

                                <div className="w-[1px] h-4 bg-gray-200 mx-2"></div>

                                <Link to="/blog/beneficios-musicoterapia" viewTransition className="px-5 py-2 text-sm font-['Outfit'] font-medium text-slate-600 hover:text-slate-900 transition-colors relative group">
                                    BLOG
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#EC008C] group-hover:w-1/2 transition-all duration-300"></span>
                                </Link>
                                <a href="#faq" className="px-5 py-2 text-sm font-['Outfit'] font-medium text-slate-600 hover:text-slate-900 transition-colors relative group">
                                    PREGUNTAS
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#EC008C] group-hover:w-1/2 transition-all duration-300"></span>
                                </a>
                                <a href="#nosotros" className="px-5 py-2 text-sm font-['Outfit'] font-medium text-slate-600 hover:text-slate-900 transition-colors relative group">
                                    NOSOTROS
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#EC008C] group-hover:w-1/2 transition-all duration-300"></span>
                                </a>
                            </div>
                        </div>

                        {/* RIGHT: Actions */}
                        <div className="flex lg:col-span-4 items-center justify-end gap-4">

                            {/* AREA PROFESIONALES */}
                            <a
                                href={CRM_URL}
                                className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 hover:border-gray-300 bg-white hover:bg-slate-50 transition-all group"
                            >
                                <div className="p-1 rounded-md bg-slate-100 group-hover:bg-[#EC008C] transition-colors">
                                    <Briefcase className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                                </div>
                                <span className="text-[11px] font-['Outfit'] font-bold text-slate-600 group-hover:text-slate-900 uppercase tracking-widest">
                                    ÁREA PROFESIONALES
                                </span>
                            </a>

                            {/* REGISTRATE CTA */}
                            <a
                                href={REGISTER_URL}
                                className="hidden lg:flex items-center gap-3 px-8 py-3 rounded-full bg-[#0A0F1D] text-white shadow-lg hover:shadow-xl hover:bg-[#EC008C] transition-all transform hover:scale-105 active:scale-95 group relative overflow-hidden"
                            >
                                <UserPlus className="w-4 h-4 text-white relative z-10" />
                                <span className="text-xs font-['Outfit'] font-bold uppercase tracking-widest relative z-10">
                                    REGÍSTRATE
                                </span>
                            </a>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-3 text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                {isMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Mobile Menu Dropdown - White */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-[90px] left-0 w-full h-[calc(100vh-90px)] bg-white border-t border-gray-100 z-50 overflow-y-auto">
                        <div className="px-6 pt-10 pb-12 space-y-8">

                            {/* Mobile Links */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <p className="text-xs font-['Outfit'] font-bold text-[#EC008C] uppercase tracking-[0.2em] pl-2 border-l-2 border-[#EC008C] ml-1">Clínica</p>
                                    <a href="#individual" className="block text-2xl font-['Outfit'] font-light text-slate-900 pl-4 hover:text-[#EC008C] transition-colors">Individual</a>
                                    <a href="#grupal" className="block text-2xl font-['Outfit'] font-light text-slate-900 pl-4 hover:text-[#EC008C] transition-colors">Grupal</a>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-xs font-['Outfit'] font-bold text-cyan-600 uppercase tracking-[0.2em] pl-2 border-l-2 border-cyan-400 ml-1">Profesionales</p>
                                    <a href="#libro" className="block text-2xl font-['Outfit'] font-light text-slate-900 pl-4 hover:text-cyan-600 transition-colors">Libro</a>
                                    <a href="#software" className="block text-2xl font-['Outfit'] font-light text-slate-900 pl-4 hover:text-cyan-600 transition-colors">Software</a>
                                    <a href="#academia" className="block text-2xl font-['Outfit'] font-light text-slate-900 pl-4 hover:text-cyan-600 transition-colors">Academia</a>
                                </div>
                                <div className="pt-6 border-t border-gray-100 space-y-4">
                                    <a href="#blog" className="block text-lg font-medium text-slate-500 pl-2 hover:text-slate-900">Blog</a>
                                    <a href="#faq" className="block text-lg font-medium text-slate-500 pl-2 hover:text-slate-900">Preguntas</a>
                                    <a href="#nosotros" className="block text-lg font-medium text-slate-500 pl-2 hover:text-slate-900">Nosotros</a>
                                </div>
                            </div>

                            {/* Mobile Actions */}
                            <div className="pt-8 border-t border-gray-100 space-y-4">
                                <a href={CRM_URL} className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-gray-200 text-slate-600 font-bold uppercase tracking-wider bg-slate-50">
                                    <Briefcase className="w-5 h-5" />
                                    Área Profesionales
                                </a>
                                <a href={REGISTER_URL} className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-[#0A0F1D] text-white font-bold uppercase tracking-wider shadow-lg">
                                    <UserPlus className="w-5 h-5" />
                                    Regístrate
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};
