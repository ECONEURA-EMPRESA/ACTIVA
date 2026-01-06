import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Save, Building, CreditCard, Mail, Globe, Moon, Sun, Shield, Bell } from 'lucide-react';
import { ClinicSettings } from '../../lib/types';
import { Toast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface SettingsViewProps {
  settings: ClinicSettings;
  onSave: (newSettings: ClinicSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSave }) => {
  const { role, login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<ClinicSettings>(settings);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setToast({ msg: 'Configuración guardada correctamente', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Configuración Clínica
          </h1>
          <p className="text-slate-500 mt-1">Datos de facturación y perfil profesional</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Info */}
          <Card className="p-8 space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Building size={20} className="text-pink-600" /> Información General
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="label-pro">Nombre de la Clínica / Profesional</label>
                <input
                  required
                  className="input-pro"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Centro de Musicoterapia Activa"
                />
              </div>
              <div className="space-y-2">
                <label className="label-pro">Dirección Fiscal</label>
                <textarea
                  className="input-pro min-h-[80px]"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle, Ciudad, Código Postal..."
                />
              </div>
              <div className="space-y-2">
                <label className="label-pro">Teléfono de Contacto</label>
                <input
                  className="input-pro"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+34 600 000 000"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide">
                Gestión de Datos
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Descarga una copia completa de tu base de datos en formato Excel/CSV.
              </p>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  alert('Iniciando exportación masiva...');
                  // Simulation of CSV generation with BOM for Excel
                  const dummyData = 'Nombre,Edad,Diagnóstico\nJuan,30,Stress\nAna,25,Ansiedad';
                  const bom = '\uFEFF';
                  const blob = new Blob([bom + dummyData], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute(
                    'download',
                    `Pacientes_Activa_${new Date().toISOString().slice(0, 10)}.csv`,
                  );
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                icon={Save}
              >
                Exportar Base de Datos (CSV)
              </Button>
            </div>
          </Card>

          {/* Appearance Config */}
          <Card className="p-8 space-y-6">
            <h3 className="font-bold text-slate-800 dark:text-gray-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
              <Moon size={20} className="text-indigo-600" /> Apariencia
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Modo Oscuro</p>
                <p className="text-sm text-slate-500">Reduce la fatiga visual en entornos oscuros</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                {theme === 'dark' ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
              </Button>
            </div>
          </Card>

          {/* Legal & Invoice Data */}
          <div className="space-y-6">
            <Card className="p-8 space-y-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                <CreditCard size={20} className="text-indigo-600" /> Datos de Facturación
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="label-pro">CIF / NIF</label>
                  <input
                    className="input-pro font-mono"
                    value={formData.cif || ''}
                    onChange={(e) => setFormData({ ...formData, cif: e.target.value })}
                    placeholder="B-12345678"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-pro">Email para Facturas</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      type="email"
                      className="input-pro pl-10"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="facturacion@empresa.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="label-pro">Sitio Web</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      className="input-pro pl-10"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="www.metodoactiva.com"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 space-y-4 bg-slate-50 border-slate-200">
              <div className="space-y-2">
                <label className="label-pro">Texto Legal (Pie de Factura)</label>
                <textarea
                  className="input-pro text-xs text-slate-500 min-h-[100px]"
                  value={formData.legalText || ''}
                  onChange={(e) => setFormData({ ...formData, legalText: e.target.value })}
                  placeholder="Términos y condiciones legales..."
                />
              </div>
            </Card>
          </div>

          {/* Simulación de Roles (Dev Tool) */}
          <Card className="p-8 space-y-6 md:col-span-2 border-dashed border-2 border-slate-300 bg-slate-50">
            <h3 className="font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest text-xs">
              <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" /> Simulación de
              Roles (Dev Mode)
            </h3>
            <div className="flex gap-4 items-center">
              <p className="text-sm text-slate-600 flex-1">
                Alterna entre roles para verificar la "Sanitización de Interfaz" (ocultación de
                precios y funciones destructivas).
              </p>
              <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => login('admin')}
                  className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${role === 'admin' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Admin (Dueño)
                </button>
                <button
                  type="button"
                  onClick={() => login('therapist')}
                  className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${role === 'therapist' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Terapeuta (Clínico)
                </button>
              </div>
            </div>

            {/* Security & Audit (Feature 16) */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-200 text-slate-600 rounded-lg">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Registro de Auditoría</h4>
                  <p className="text-xs text-slate-500">Log de accesos y cambios (HIPAA)</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate('/audit')}>Ver Logs</Button>
            </div>
          </Card>

          {/* Notificaciones (Feature 15) */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bell size={20} className="text-pink-500" /> Notificaciones
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm">Notificaciones Push</h4>
                    <p className="text-xs text-slate-500">Avisos al móvil/escritorio</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex justify-end">
          <Button type="submit" className="w-full md:w-auto px-8" icon={Save}>
            Guardar Cambios
          </Button>
        </div>
      </form>

      {/* DANGER ZONE (GDPR - Delete Account) */}
      <Card className="p-8 border-red-200 bg-red-50 mt-8">
        <h3 className="font-bold text-red-700 flex items-center gap-2 mb-4">
          <Shield size={20} /> Zona de Peligro
        </h3>
        <p className="text-sm text-red-600 mb-6">
          Estas acciones son destructivas y no se pueden deshacer.
        </p>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-red-800 text-sm">Eliminar Cuenta</h4>
            <p className="text-xs text-red-600">Borrar todos mis datos y salir</p>
          </div>
          <Button
            variant="secondary"
            className="border-red-200 text-red-700 hover:bg-red-100"
            onClick={() => {
              if (window.confirm('¿ESTÁS SEGURO? Esto borrará tu cuenta y todos tus pacientes permanentemente.')) {
                // In a real implementation this would call deleteUser(user)
                alert('Por seguridad, contacta a soporte@activamusicoterapia.com para confirmar la baja definitiva GDPR.');
              }
            }}
          >
            Eliminar Cuenta
          </Button>
        </div>
      </Card>

      {/* LEGAL FOOTER */}
      <div className="text-center text-xs text-slate-400 py-8 flex justify-center gap-6">
        <a href="https://activamusicoterapia.com/legal/terms" target="_blank" rel="noreferrer" className="hover:text-slate-600 transition-colors">Términos de Servicio</a>
        <a href="https://activamusicoterapia.com/legal/privacy" target="_blank" rel="noreferrer" className="hover:text-slate-600 transition-colors">Política de Privacidad</a>
        <span>© 2026 Método Activa</span>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
