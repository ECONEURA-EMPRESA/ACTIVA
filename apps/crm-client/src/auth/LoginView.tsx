import React, { useState } from 'react';
import { useFirebaseAuthState } from './useAuth';
import { Loader2, Activity, ShieldCheck, ArrowRight, Lock, Fingerprint } from 'lucide-react';
import loginBg from '../assets/login-bg-metallic.png';
import logoCircular from '../assets/logo-alpha.png';

interface LoginViewProps {
  onDemoLogin?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onDemoLogin }) => {
  const { signIn, signUp, signInWithGoogle, loading, error } = useFirebaseAuthState();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (!termsAccepted) {
        alert('Debes aceptar los Términos y Política de Privacidad para continuar.');
        return;
      }
      await signUp(email, password);
    } else {
      await signIn(email, password);
    }
  };

  // Configurar Google Button Handler
  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-slate-50">
      {/* FONDO 3D METÁLICO CON PARTÍCULAS (Sin Logo Overlay) */}
      <div className="absolute inset-0 z-0">
        <img
          src={loginBg}
          alt="Metallic Clinical Atmosphere"
          className="w-full h-full object-cover animate-in fade-in duration-1000"
        />
        {/* Suave overlay blanco para garantizar limpieza clínica */}
        <div className="absolute inset-0 bg-white/30 mix-blend-overlay"></div>
      </div>

      {/* PANEL CENTRAL 'METÁLICO' */}
      <div className="relative z-10 w-full max-w-[460px] animate-in zoom-in-95 duration-500">
        {/* Sombra de elevación 'Premium' y Borde Metálico */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 shadow-2xl border border-white/50 overflow-hidden ring-1 ring-white/60 mx-4 md:mx-0 w-full md:w-auto">
          {/* Efecto de brillo metálico superior */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></div>
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-50"></div>

          {/* HEADER: LOGO SOLO AL LADO DE TEXTO (Petición explícita) */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-16 h-16 rounded-full p-1 bg-gradient-to-br from-white/40 to-white/10 shadow-lg shadow-pink-500/20 ring-1 ring-white/40 backdrop-blur-md overflow-hidden">
                <img
                  src={logoCircular}
                  alt="Activa Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-800">
                MÉTODO<span className="text-[#EC008C]">ACTIVA</span>
              </h1>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Clinical SaaS v2.0
            </p>
          </div>

          {/* Bienvenida */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-slate-700">
              {isRegistering ? 'Alta de Profesional' : 'Acceso Seguro'}
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              {isRegistering
                ? 'Inicie su ecosistema clínico.'
                : 'Ingrese sus credenciales verificadas.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                ID Clínico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#EC008C] transition-colors">
                  <Lock size={16} />
                </div>
                {/* Input 'Metalizado' */}
                <input
                  type="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoComplete="username"
                  placeholder="doctor@clinica.com"
                  className="w-full bg-gradient-to-b from-slate-50 to-white border border-slate-200 text-slate-800 rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-[#EC008C]/20 focus:border-[#EC008C] outline-none transition-all placeholder:text-slate-400 font-medium shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between ml-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Contraseña
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#EC008C] transition-colors">
                  <ShieldCheck size={16} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gradient-to-b from-slate-50 to-white border border-slate-200 text-slate-800 rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-[#EC008C]/20 focus:border-[#EC008C] outline-none transition-all placeholder:text-slate-400 font-medium shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {isRegistering && (
              <div className="flex items-start gap-3 mt-4 px-1">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 text-[#EC008C] border border-slate-300 rounded focus:ring-[#EC008C]"
                  />
                </div>
                <div className="ml-1 text-xs">
                  <label htmlFor="terms" className="text-slate-500 font-medium">
                    He leído y acepto los <a href="https://activamusicoterapia.com/legal/terms" target="_blank" rel="noreferrer" className="text-[#EC008C] hover:underline">Términos de Servicio</a> y la <a href="https://activamusicoterapia.com/legal/privacy" target="_blank" rel="noreferrer" className="text-[#EC008C] hover:underline">Política de Privacidad</a>.
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-gradient-to-br from-[#EC008C] to-pink-700 hover:to-pink-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4 border-t border-white/20 ${(isRegistering && !termsAccepted) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {isRegistering ? 'Crear Cuenta' : 'Entrar al Sistema'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Separador */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-slate-500 font-medium">O continúa con</span>
              </div>
            </div>

            {/* Botón Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Si no tienes cuenta, se creará automáticamente.
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col gap-3 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm font-bold text-[#EC008C] hover:text-pink-700 transition-colors uppercase tracking-wide border-b border-transparent hover:border-pink-200 pb-0.5"
            >
              {isRegistering
                ? 'Volver al Inicio de Sesión'
                : '¿Nueva Clínica? Registro Profesional'}
            </button>

            <button
              onClick={onDemoLogin}
              className="w-full py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-sm"
            >
              <Fingerprint size={14} className="text-emerald-500" />
              Acceso Demo / Auditoría
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase opacity-70 flex items-center justify-center gap-2">
            <ShieldCheck size={12} />
            Secured by Google Cloud Platform
          </p>
        </div>
      </div>
    </div>
  );
};
