import React from 'react';

interface PatientTabsProps {
  activeTab: 'plan' | 'formulation' | 'evaluation' | 'sessions' | 'billing';
  onChange: (tab: 'plan' | 'formulation' | 'evaluation' | 'sessions' | 'billing') => void;
}

export const PatientTabs: React.FC<PatientTabsProps> = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'plan', label: 'Plan Terapéutico' },
    { id: 'formulation', label: 'Formulación Clínica' },
    { id: 'evaluation', label: 'Evaluación y Progreso' },
    { id: 'sessions', label: 'Historial Sesiones' },
    { id: 'billing', label: 'Facturación' },
  ];

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id as any)}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
            activeTab === tab.id
              ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
