import React, { useState, useMemo } from 'react';
import { Search, Plus, Users, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { PatientAvatar } from '../../components/ui/PatientAvatar';
import { Patient, GroupSession } from '../../lib/types'; // Updated import
import { PATHOLOGY_MAP } from '../../lib/patientUtils';
import { EditProfileModal } from './modals/EditProfileModal';
import { useFirebaseAuthState as useAuth } from '../../auth/useAuth';
import { PaywallModal } from '../../components/ui/PaywallModal';
// import { BirthdayRadar } from '../../components/ui/BirthdayRadar';

interface PatientsDirectoryProps {
  patients: Patient[];
  groupSessions?: GroupSession[]; // NEW
  onSelectPatient: (patient: Patient) => void;
  // onNavigate removed (unused)
  onSelectGroup?: (groupName: string) => void; // NEW
  onNewPatient: (data: Omit<Patient, 'id'>) => void;
  initialFilter?: 'all' | 'adults' | 'kids';
}

export const PatientsDirectory: React.FC<PatientsDirectoryProps> = ({
  patients,
  groupSessions = [],
  onSelectPatient,
  onSelectGroup,
  onNewPatient,
  initialFilter = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'individual' | 'groups'>('individual');
  const [search, setSearch] = useState('');
  const [filterPathology, setFilterPathology] = useState('all');
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { isPremium } = useAuth();

  const handleNewPatientClick = () => {
    // Business Rule: Free tier allows up to 2 patients. 3rd triggers Paywall.
    if (!isPremium && patients.length >= 2) {
      setShowPaywall(true);
    } else {
      setIsAdmissionOpen(true);
    }
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
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
  }, [patients, search, filterPathology, initialFilter]);

  // Unique Groups Calculation
  const uniqueGroups = useMemo(() => {
    const groups = new Map<string, { count: number; lastDate: string; participants: number }>();

    groupSessions.forEach(s => {
      if (!s.groupName) return; // Skip unnamed
      const existing = groups.get(s.groupName) || { count: 0, lastDate: '', participants: 0 };
      groups.set(s.groupName, {
        count: existing.count + 1,
        lastDate: s.date > existing.lastDate ? s.date : existing.lastDate,
        participants: Math.max(existing.participants, s.participantNames?.length || 0)
      });
    });

    return Array.from(groups.entries()).map(([name, stats]) => ({
      name,
      ...stats
    })).filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  }, [groupSessions, search]);




  // ... inside component render, before header or tabs
  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      {/* RADAR DE CUMPLEAÑOS (TITANIUM FEATURE) */}
      {/* <BirthdayRadar patients={patients} /> */}

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Gestión Clínica
          </h1>
          <p className="text-slate-500 mt-1">Expedientes individuales y grupos terapéuticos</p>
        </div>
        <div className="flex gap-3">
          <Button icon={Plus} onClick={handleNewPatientClick}>
            Nuevo Paciente
          </Button>
        </div>
      </header>

      {/* MODE TABS - ONLY SHOW IF NOT FILTERED */}
      {initialFilter === 'all' && (
        <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'individual' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <User size={16} /> Individual
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'groups' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Users size={16} /> Grupos
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            className="input-pro pl-10"
            placeholder={activeTab === 'individual' ? "Buscar paciente..." : "Buscar grupo..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {activeTab === 'individual' && (
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {initialFilter === 'kids' ? (
              // KIDS FILTERS
              [
                { id: 'all', label: 'Todos' },
                { id: 'autism', label: 'TEA' },
                { id: 'adhd', label: 'TDAH' },
                { id: 'development', label: 'Desarrollo' },
                { id: 'palsy', label: 'Parálisis C.' },
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
              ))
            ) : initialFilter === 'adults' ? (
              // ADULT FILTERS
              [
                { id: 'all', label: 'Todos' },
                { id: 'dementia', label: 'Demencias' },
                { id: 'neuro', label: 'Neuro' },
                { id: 'mood', label: 'Salud Mental' },
                { id: 'palliative', label: 'Cuidados P.' },
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
              ))
            ) : (
              // ALL - DEFAULT
              [
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
              ))
            )}
          </div>
        )}
      </div>

      {/* VIEW CONTENT */}
      {activeTab === 'individual' ? (
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
                  {PATHOLOGY_MAP[p.diagnosis] || p.diagnosis}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {uniqueGroups.length === 0 && (
            <EmptyState
              icon={Users}
              title="No hay grupos creados"
              description="Crea tu primer grupo terapéutico para gestionar sesiones colectivas."
              className="col-span-full"
            />
          )}
          {uniqueGroups.map((g) => (
            <Card
              key={g.name}
              hoverable
              onClick={() => onSelectGroup && onSelectGroup(g.name)}
              className="cursor-pointer group relative overflow-hidden border border-slate-200"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-black">{g.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-slate-900 mt-2 text-lg group-hover:text-purple-600 transition-colors">
                  {g.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded-md mt-2">
                  Grupo Terapéutico
                </p>

                <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Historial
                    </p>
                    <p className="font-bold text-slate-700">{g.count} Sesiones</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Participantes
                    </p>
                    <p className="font-bold text-slate-700">~{g.participants}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isAdmissionOpen && (
        <EditProfileModal
          onClose={() => setIsAdmissionOpen(false)}
          onSave={(data) => {
            onNewPatient(data as Omit<Patient, 'id'>);
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
