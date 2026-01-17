import React, { useState } from 'react';
import { X, BookOpen, User, Brain, Heart, Sparkles } from 'lucide-react';
import { CLINICAL_GUIDES } from '../../../lib/clinicalUtils';

interface ClinicalGuideModalProps {
  onClose: () => void;
}

export const ClinicalGuideModal: React.FC<ClinicalGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'dementia' | 'neuro' | 'mood' | 'other'>('dementia');
  const guide = CLINICAL_GUIDES[activeTab];

  const tabs = [
    { id: 'dementia', label: 'Cognitivo', icon: Brain, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'neuro', label: 'Neurológico', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    {
      id: 'mood',
      label: 'Salud Mental',
      icon: Heart,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    { id: 'other', label: 'Bienestar', icon: Sparkles, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-3d overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800">
            <BookOpen className="text-pink-600" /> Guías Clínicas Básicas
          </h2>
          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        <div className="flex border-b border-slate-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'dementia' | 'neuro' | 'mood' | 'other')}
              className={`flex-1 min-w-[120px] py-4 flex flex-col items-center gap-2 border-b-2 transition-all ${activeTab === tab.id ? `${tab.color} border-current bg-slate-50` : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <tab.icon size={20} />
              <span className="text-xs font-bold uppercase tracking-wide">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-8 overflow-y-auto bg-slate-50/50">
          <div className="prose prose-slate max-w-none">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-6">
              <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                {guide.title}
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">
                  Protocolo MT
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-pink-600 mb-4 border-b border-pink-100 pb-2 uppercase text-sm tracking-wide">
                    Objetivos Terapéuticos
                  </h4>
                  <ul className="space-y-3">
                    {guide.objectives.map((o, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 shrink-0"></div>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-blue-600 mb-4 border-b border-blue-100 pb-2 uppercase text-sm tracking-wide">
                    Técnicas Sugeridas
                  </h4>
                  <ul className="space-y-3">
                    {guide.techniques.map((t, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-amber-50 p-6 rounded-xl border border-amber-100">
                <h4 className="font-bold text-amber-700 mb-3 flex items-center gap-2 uppercase text-sm tracking-wide">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>{' '}
                  Precauciones y Contraindicaciones
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {guide.precautions.map((p, i) => (
                    <li
                      key={i}
                      className="text-sm font-medium text-amber-900/80 flex items-center gap-2"
                    >
                      <span className="text-amber-400">•</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
