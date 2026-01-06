import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PatientAvatar } from '../../components/ui/PatientAvatar';
import { Patient } from '../../lib/types';
import { AdmissionModal } from './modals/AdmissionModal';
import { useFirebaseAuthState as useAuth } from '../../auth/useAuth';
import { PaywallModal } from '../../components/ui/PaywallModal';

interface PatientsDirectoryProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNewPatient: (data: any) => void;
  initialFilter?: 'all' | 'adults' | 'kids';
}

export const PatientsDirectory: React.FC<PatientsDirectoryProps> = ({
  patients,
  onSelectPatient,
  onNewPatient,
  initialFilter = 'all',
}) => {
  const [search, setSearch] = useState('');
  const [filterPathology, setFilterPathology] = useState('all');
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { isPremium } = useAuth();

  const handleNewPatientClick = () => {
    if (!isPremium && patients.length >= 1) {
      setShowPaywall(true);
    } else {
      setIsAdmissionOpen(true);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase());

    const matchesPathology = filterPathology === 'all' || p.pathologyType === filterPathology;

    let matchesAge = true;
    if (initialFilter === 'adults') matchesAge = (p.age as number) >= 15;
    // Teens removed. Children is strictly < 15
    if (initialFilter === 'kids') matchesAge = (p.age as number) < 15;

    return matchesSearch && matchesPathology && matchesAge;
  });

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Directorio de Pacientes
          </h1>
          <p className="text-slate-500 mt-1">Gestión clínica y expedientes</p>
        </div>
        <div className="flex gap-3">
          <Button icon={Plus} onClick={handleNewPatientClick}>
            Nuevo Paciente
          </Button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            className="input-pro pl-10"
            placeholder="Buscar por nombre, diagnóstico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'dementia', label: 'Demencias' },
            { id: 'neuro', label: 'Neuro' },
            { id: 'mood', label: 'Salud Mental' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterPathology(f.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${filterPathology === f.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPatients.map((p) => (
          <Card
            key={p.id}
            hoverable
            onClick={() => onSelectPatient(p)}
            className="cursor-pointer group relative overflow-hidden border border-slate-200"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="flex flex-col items-center text-center">
              <PatientAvatar name={p.name} photo={p.photo} size="lg" />
              <h3 className="font-bold text-slate-900 mt-4 text-lg group-hover:text-pink-600 transition-colors">
                {p.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md mt-2">
                {p.diagnosis}
              </p>

              <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Edad
                  </p>
                  <p className="font-bold text-slate-700">{p.age} años</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Sesiones
                  </p>
                  <p className="font-bold text-slate-700">{p.sessions?.length || 0}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isAdmissionOpen && (
        <AdmissionModal
          onClose={() => setIsAdmissionOpen(false)}
          onSave={(data) => {
            onNewPatient(data);
            setIsAdmissionOpen(false);
          }}
        />
      )}

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        limitType="patient"
      />
    </div>
  );
};
