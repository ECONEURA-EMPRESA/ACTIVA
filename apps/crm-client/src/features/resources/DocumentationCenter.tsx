import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { BookOpen, FileText, ExternalLink } from 'lucide-react';
import { CLINICAL_GUIDES } from '../../lib/constants';
import { ClinicalGuideModal } from './ClinicalGuideModal';
import { useActivityLog } from '../../hooks/useActivityLog';
import { ClinicalTemplates } from './ClinicalTemplates';

export const DocumentationCenter: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const { logActivity } = useActivityLog();

  const handleOpenGuide = (key: string) => {
    setSelectedGuide(key);
    logActivity('system', `Consulta de Guía Clínica: ${CLINICAL_GUIDES[key]?.title}`);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(CLINICAL_GUIDES).map(([key, guide]) => (
              <Card
                key={key}
                onClick={() => handleOpenGuide(key)}
                className="p-6 hover:shadow-lg transition-all group cursor-pointer border-t-4 border-indigo-500 hover:-translate-y-1"
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
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Clinical Templates (Printable) */}
        <div className="lg:col-span-3">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
            <FileText size={18} className="text-pink-500" /> Plantillas de Evaluación (Imprimibles)
          </h3>
          <ClinicalTemplates />
        </div>

        {/* External Links & System Info Column */}
        <div className="space-y-6">
          <Card className="p-6">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ExternalLink size={18} className="text-emerald-600" /> Referencias Externas
            </h4>
            <div className="space-y-3">
              {[
                { title: 'Pubmed: Music Therapy & Dementia', url: 'https://pubmed.ncbi.nlm.nih.gov/?term=music+therapy+dementia' },
                { title: 'Asociación Española de Musicoterapia (ADIMTE)', url: 'https://www.adimte.org/' },
                { title: 'World Federation of Music Therapy', url: 'https://wfmt.info' },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
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

      <ClinicalGuideModal
        isOpen={!!selectedGuide}
        onClose={() => setSelectedGuide(null)}
        pathologyType={selectedGuide || 'other'}
      />
    </div>
  );
};
