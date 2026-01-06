import React from 'react';
import { Card } from '../../components/ui/Card';
import { FileText, Download, ExternalLink, BookOpen } from 'lucide-react';
import { CLINICAL_GUIDES } from '../../lib/constants';

export const DocumentationCenter: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Centro de Documentación
        </h1>
        <p className="text-slate-500 mt-1">
          Recursos clínicos, guías y protocolos oficiales del Método Activa.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Clinical Guides Section */}
        <div className="lg:col-span-3">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
            <BookOpen size={18} className="text-indigo-500" /> Guías Clínicas Integradas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(CLINICAL_GUIDES).map(([key, guide]) => (
              <Card
                key={key}
                className="p-6 hover:shadow-lg transition-all group cursor-pointer border-t-4 border-indigo-500"
              >
                <h4 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {guide.title}
                </h4>
                <div className="space-y-2">
                  {guide.techniques.slice(0, 3).map((t: string, i: number) => (
                    <div
                      key={i}
                      className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100 truncate"
                    >
                      {t}
                    </div>
                  ))}
                  {guide.techniques.length > 3 && (
                    <div className="text-[10px] text-indigo-500 font-bold px-1">
                      +{guide.techniques.length - 3} más
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Downloadable Resources (Mock) */}
        <Card className="p-6">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Download size={18} className="text-pink-600" /> Plantillas PDF
          </h4>
          <div className="space-y-3">
            {[
              'Consentimiento Informado v2024.pdf',
              'Hoja de Registro de Sesión.pdf',
              'Escala MOCA (Vacía).pdf',
              'Cuestionario de Ingreso.pdf',
            ].map((file, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-pink-50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-slate-400 group-hover:text-pink-500" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                    {file}
                  </span>
                </div>
                <Download size={14} className="text-slate-300 group-hover:text-pink-600" />
              </div>
            ))}
          </div>
        </Card>

        {/* External Links */}
        <Card className="p-6">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ExternalLink size={18} className="text-emerald-600" /> Referencias Externas
          </h4>
          <div className="space-y-3">
            {[
              { title: 'Pubmed: Music Therapy & Dementia', url: '#' },
              { title: 'Asociación Española de Musicoterapia', url: '#' },
              { title: 'World Federation of Music Therapy', url: '#' },
            ].map((link, i) => (
              <a
                key={i}
                href={link.url}
                className="block p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-800">
                    {link.title}
                  </span>
                  <ExternalLink size={12} className="text-slate-300 group-hover:text-emerald-600" />
                </div>
              </a>
            ))}
          </div>
        </Card>

        {/* System Info */}
        <Card className="p-6 bg-slate-900 text-white">
          <h4 className="font-bold text-white mb-4">Información del Sistema</h4>
          <div className="space-y-4 text-sm text-slate-400">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Versión CRM</span>
              <span className="font-mono text-emerald-400">v1.1.0</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>Licencia</span>
              <span className="text-white">Professional SaaS</span>
            </div>
            <div className="flex justify-between">
              <span>Soporte</span>
              <span className="text-white">soporte@metodoactiva.com</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
