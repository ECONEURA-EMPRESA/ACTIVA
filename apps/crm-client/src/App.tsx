import React, { useState, Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';

// LAYOUT & THEME

import { AppLayout } from '@/layout/AppLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// AUTH
import { LoginView } from '@/auth/LoginView';
import { useFirebaseAuthState as useAuth } from '@/auth/useAuth';

// FEATURES (LAZY LOADED)
const DashboardView = lazy(() =>
  import('@/features/dashboard/DashboardView').then((module) => ({
    default: module.DashboardView,
  })),
);
const PatientsDirectory = lazy(() =>
  import('@/features/patients/PatientsDirectory').then((module) => ({
    default: module.PatientsDirectory,
  })),
);
const PatientDetail = lazy(() =>
  import('./features/patients/PatientDetail').then((module) => ({ default: module.PatientDetail })),
);
const SessionsManager = lazy(() =>
  import('./features/sessions/SessionsManager').then((module) => ({
    default: module.SessionsManager,
  })),
);
const GroupSessionsHistory = lazy(() =>
  import('./features/sessions/GroupSessionsHistory').then((module) => ({
    default: module.GroupSessionsHistory,
  })),
);
const CalendarView = lazy(() =>
  import('./features/sessions/CalendarView').then((module) => ({ default: module.CalendarView })),
);
const SettingsView = lazy(() =>
  import('./features/settings/SettingsView').then((module) => ({ default: module.SettingsView })),
);
const DocumentationCenter = lazy(() =>
  import('./features/resources/DocumentationCenter').then((module) => ({
    default: module.DocumentationCenter,
  })),
);
const AuditView = lazy(() =>
  import('./features/settings/AuditView').then((module) => ({
    default: module.AuditView,
  })),
);
const ReportsView = lazy(() =>
  import('./features/reports/ReportsView').then((module) => ({
    default: module.ReportsView,
  })),
);
const BillingView = lazy(() =>
  import('./features/billing/BillingView').then((module) => ({
    default: module.BillingView,
  })),
);

// MODALS (Eager loaded for smoother UX on interactions, or Lazy if strictly optimizing bundle)
import { QuickAppointmentModal } from './features/sessions/modals/QuickAppointmentModal';
import { CreateGroupModal } from './features/patients/modals/CreateGroupModal';
import { GroupSessionModal } from './features/sessions/modals/GroupSessionModal';
import { SessionRepository } from './data/repositories/SessionRepository';
import { CommandMenu } from './components/ui/CommandMenu'; // NEW
import { GroupDetailView } from './features/patients/GroupDetailView'; // NEW
import { GroupsDirectory } from './features/patients/GroupsDirectory';

// STORES
import { useUIStore } from './stores/useUIStore';

// API & TYPES
import { Patient, GroupSession } from './lib/types';

// Loading Spinner for Code Splitting Suspense
const PageLoader = () => (
  <div className="flex h-full min-h-[50vh] items-center justify-center">
    <Loader2 className="animate-spin text-pink-500 opacity-50" size={32} />
  </div>
);

// Main App Component
// Main App Component
import { usePatients, useCreatePatient, useUpdatePatient } from './api/queries';
import { queryKeys } from './api/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { useActivityLog } from './hooks/useActivityLog';

// --- DEFAULT CONSTANTS FOR STRICT TYPES ---
const DEFAULT_SAFETY_PROFILE = {
  epilepsy: false,
  dysphagia: false,
  flightRisk: false,
  psychomotorAgitation: false,
  hyperacusis: false,
  chokingHazard: false,
  disruptiveBehavior: false,
  alerts: [],
  mobilityAid: 'none' as const,
  allergies: '',
};

const DEFAULT_MUSICAL_IDENTITY = {
  likes: [],
  dislikes: [],
  biographicalSongs: [],
  instrumentsOfInterest: [],
  musicalTraining: false,
  sensitivityLevel: 'medium' as const,
};

const DEFAULT_SOCIAL_CONTEXT = {
  livingSituation: '',
  caregiverNetwork: '',
  recentLifeEvents: [],
};

function App() {
  const { user, loading: authLoading, demoMode, enterDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // GLOBAL STATE (Server State via React Query)
  const { data: patients = [], isLoading: isLoadingPatients } = usePatients(demoMode || !user);
  // const { data: clinicSettings = {} as ClinicSettings, isLoading: isLoadingSettings } = useSettings(demoMode || !user);

  // MUTATIONS
  const createPatient = useCreatePatient(demoMode);
  const updatePatient = useUpdatePatient(demoMode);
  // const updateSettings = useUpdateSettings(demoMode);

  // UI STORE (ZUSTAND - TITANIUM ARCHITECTURE)
  const quickAppointment = useUIStore((state) => state.quickAppointment);
  const groupSession = useUIStore((state) => state.groupSession);

  const isLoadingData = isLoadingPatients;

  // MODAL STATES
  const [groupSessions, setGroupSessions] = useState<GroupSession[]>([]);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  // LOAD GROUP SESSIONS (TITANIUM PERMANENCE)
  React.useEffect(() => {
    if (user) {
      import('./data/repositories/GroupSessionRepository').then(({ GroupSessionRepository }) => {
        GroupSessionRepository.getAll().then(setGroupSessions);
      });
    }
  }, [user]);

  const handleSaveGroupSession = async (data: any) => {


    // 1. Optimistic Update (Visible immediately in Group Views)
    setGroupSessions((prev) => [...prev, data]);
    groupSession.close();

    // 2. Persist to Firestore (Fan-Out Transaction)
    try {
      const { GroupSessionRepository } = await import('./data/repositories/GroupSessionRepository');
      const { SessionRepository } = await import('./data/repositories/SessionRepository');

      // A. SAVE MASTER GROUP RECORD
      await GroupSessionRepository.create(data);

      // B. FAN-OUT: Sync to Individual Patient Histories (Billing & Personal Logs)
      if (data.participants && Array.isArray(data.participants)) {
        const linkedParticipants = data.participants.filter((p: any) => p.id); // Only those with IDs

        if (linkedParticipants.length > 0) {


          // We iterate and create individual sessions
          // Ideally this should be a Batch, but for now concurrent promises is fine for Beta.
          const syncPromises = linkedParticipants.map(async (p: any) => {
            const individualSessionPayload = {
              date: data.date, // ISO YYYY-MM-DD from Modal 
              // SessionRepository.create handles ID generation.
              // We need to convert the Group Date to ISO if it's not already.
              // data.date came from formatDateForDisplay (DD/MM/YYYY) which is bad for sorting but that's what we have.
              // Let's rely on SessionRepository types.

              // Actually, let's use the Date object if possible, or ISO string.
              // GroupSessionModal saves 'date' as DD/MM/YYYY string. 
              // We should probably save it as ISO in the individual record for better querying.
              // But for now, let's just mirror the data.

              id: `GS-${data.id}-${p.id}`, // Unique ID for this user's copy
              type: 'group' as const,
              groupName: data.groupName,
              groupId: data.id, // LINK TO MASTER
              notes: `Sesión Grupal: ${data.groupName}. ${data.observations || ''}`,
              // Price per person = Total / Count
              price: Math.round(Number(data.price) / (data.participants.length || 1)),
              paid: false,
              billable: true,
              isAbsent: false, // Titanium Strict Type
              activities: data.activities || [],
            };

            // Fire and forget individual creation
            // Now strictly typed thanks to Shared Schema update
            return SessionRepository.create(p.id, individualSessionPayload);
          });

          await Promise.all(syncPromises);

          // Force refresh of patients to show new sessions in PatientDetail immediately
          queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });


        }
      }

      logActivity('session', `Sesión Grupal creada: ${data.date} (${data.participants?.length || 0} pax)`);
    } catch (e) {
      console.error("Failed to save group session", e);
      alert("Error al guardar en base de datos: " + e);
    }
  };
  const getCurrentViewID = (pathname: string) => {
    if (pathname === '/' || pathname === '/dashboard') return 'dashboard';
    if (pathname === '/patients/adults') return 'patients-adults';
    if (pathname === '/patients/kids') return 'patients-kids';
    if (pathname.startsWith('/patients')) return 'patients';
    if (pathname === '/sessions') return 'sessions';
    if (pathname === '/sessions/group') return 'group-sessions';
    if (pathname === '/calendar') return 'calendar';
    if (pathname === '/settings') return 'settings';
    if (pathname === '/resources') return 'resources';
    if (pathname === '/billing') return 'billing';
    return 'dashboard';
  };

  const currentView = getCurrentViewID(location.pathname);

  // ROUTING HANDLER (ADAPTER FOR LEGACY COMPONENTS)
  const handleNavigate = (viewId: string, data?: { id?: string | number } | string) => {
    switch (viewId) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'patients':
        navigate('/patients');
        break;
      case 'patients-adults':
        navigate('/patients/adults');
        break;
      case 'patients-kids':
        navigate('/patients/kids');
        break;
      case 'sessions':
        navigate('/sessions');
        break;
      case 'groups':
        navigate('/groups');
        break;
      case 'group-sessions':
        navigate('/sessions/group');
        break;
      case 'group-sessions-history':
        navigate('/sessions/group-history');
        break;
      case 'calendar':
        navigate('/calendar');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'resources':
        navigate('/resources');
        break;
      case 'patient-detail':
        if (typeof data !== 'string' && data?.id) navigate(`/patients/${data.id}`);
        else if (typeof data === 'string')
          navigate(`/patients/${data}`); // Handle ID passed directly
        else navigate('/patients');
        break;
      case 'reports':
        navigate('/reports');
        break;
      case 'billing':
        navigate('/billing');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // LOGGING HOOK
  const { logActivity } = useActivityLog();

  // HANDLERS (REACT QUERY MUTATIONS)
  const handleUpdatePatient = async (updatedPatient: Patient) => {
    updatePatient.mutate(updatedPatient, {
      onSuccess: () => {
        logActivity('patient', `Paciente actualizado: ${updatedPatient.name}`);
        // navigate('/dashboard'); // REMOVED: Keep user on current screen (Titanium Standard)
      },
      onError: (err) => console.error('Failed to sync update:', err)
    });
  };

  const handleNewPatient = async (newPatientData: Omit<Patient, 'id' | 'sessions' | 'clinicalFormulation' | 'reference'>) => {
    const payload = {
      ...newPatientData,
      sessions: [],
      clinicalFormulation: {},
      reference: `REF-${Math.floor(Math.random() * 10000)}`,
      sessionsCompleted: 0,
      safetyProfile: DEFAULT_SAFETY_PROFILE,
      musicalIdentity: DEFAULT_MUSICAL_IDENTITY,
      socialContext: DEFAULT_SOCIAL_CONTEXT,
    };

    createPatient.mutate(payload, {
      onSuccess: () => {
        logActivity('patient', `Nuevo paciente registrado: ${newPatientData.name}`);
        // navigate('/dashboard'); // Removed per user request: 'no salir de pantalla'
      },
      onError: (err) => console.error('Failed to create:', err)
    });
  };

  /* TITANIUM UPGRADE: Syncs Quick Appointments with Subcollection & Legacy Array */
  const handleQuickAppointment = async (data: { date: string; time: string; name: string; mode: 'new' | 'existing'; patientId?: string | number }) => {
    // 1. ISO DATE STANDARD (YYYY-MM-DD)
    const isoDate = data.date; // Input is already ISO from <input type="date">

    const newSessionBase = {
      date: isoDate,
      time: data.time,
      type: 'individual' as const,
      notes: 'Cita programada desde Calendario',
      price: 50,
      paid: false,
      isAbsent: false,
      billable: true,
      activities: [] as string[],
    };

    if (data.mode === 'new') {
      // Create Patient + Session (Legacy Array only for now, manual migration later or dual write if possible)
      // Since we don't have patientId yet, we rely on Legacy Array. 
      // TIP: New SessionRepository migration tool will pick this up later.
      // OR: We can't write to subcollection without ID.
      const payload = {
        name: data.name,
        age: 0,
        diagnosis: 'Sin diagnosticar',
        pathologyType: 'other' as const,
        joinedDate: isoDate,
        sessions: [{ id: Date.now().toString(), ...newSessionBase }],
        clinicalFormulation: {},
        reference: `REF-${Date.now().toString().slice(-4)}`,
        sessionsCompleted: 1,
        safetyProfile: DEFAULT_SAFETY_PROFILE,
        musicalIdentity: DEFAULT_MUSICAL_IDENTITY,
        socialContext: DEFAULT_SOCIAL_CONTEXT,
      };

      createPatient.mutate(payload, {
        onSuccess: () => {
          logActivity('session', 'Cita rápida creada (Nuevo Paciente)');
          // Ideally we would migrate immediately, but let's trust the Migration Button in Settings/PatientDetail
        }
      });
    } else {
      const patient = patients.find((p) => p.id == data.patientId);
      if (patient && patient.id) {
        // 2. DUAL WRITE STRATEGY
        // A. Legacy Array (for PatientDetail Legacy Tab)
        const updatedSessions = [{ id: Date.now().toString(), ...newSessionBase }, ...(patient.sessions || [])];
        const updatedPatient = { ...patient, sessions: updatedSessions } as Patient;

        // B. Titanium Subcollection (for CalendarView)
        // Fire and forget subcollection write
        SessionRepository.create(String(patient.id), newSessionBase as any)
          .then(() => { })
          .catch(err => console.error("Titanium Sync Error:", err));

        updatePatient.mutate(updatedPatient, {
          onSuccess: () => logActivity('session', `Cita rápida creada para ${patient.name}`)
        });
      }
    }
    quickAppointment.close();
  };



  const events = React.useMemo(() => {
    const individualEvents = patients.flatMap((p) =>
      (p.sessions || []).map((s) => ({
        date: s.date,
        time: s.time || '00:00',
        type: (s.type || 'individual') as 'individual' | 'group',
        patientName: p.name, // Added Name
      })),
    );
    const groupEventsList = groupSessions.map((s) => ({
      date: s.date,
      time: s.time || '00:00',
      type: 'group' as const,
      patientName: 'Grupo'
    }));
    return [...individualEvents, ...groupEventsList];
  }, [patients, groupSessions]);

  if (authLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-pink-600" size={48} />
      </div>
    );

  if (!user && !demoMode) {
    return (
      <>

        <LoginView onDemoLogin={enterDemoMode} />
      </>
    );
  }

  if (isLoadingData)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );

  return (
    <ErrorBoundary>

      <AppLayout
        userEmail={user?.email || 'demo@activa.com'}
        currentView={currentView}
        onNavigate={(view) => handleNavigate(view)}
        onLogout={() => window.location.reload()}
        events={events}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={<DashboardView patients={patients} onViewChange={handleNavigate} />}
            />

            <Route
              path="/patients"
              element={
                <PatientsDirectory
                  patients={patients}
                  groupSessions={groupSessions} // NEW
                  onSelectPatient={(p) => navigate(`/patients/${p.id}`)}
                  onSelectGroup={(gName) => navigate(`/groups/${encodeURIComponent(gName)}`)} // NEW
                  onNewPatient={handleNewPatient}
                  initialFilter="all"
                />
              }
            />
            {/* ... other filters ... */}
            <Route
              path="/patients/adults"
              element={
                <PatientsDirectory
                  patients={patients}
                  groupSessions={groupSessions} // NEW
                  onSelectPatient={(p) => navigate(`/patients/${p.id}`)}
                  onNewPatient={handleNewPatient}
                  initialFilter="adults"
                  onSelectGroup={(gName) => navigate(`/groups/${encodeURIComponent(gName)}`)}
                />
              }
            />
            <Route
              path="/patients/kids"
              element={
                <PatientsDirectory
                  patients={patients}
                  groupSessions={groupSessions}
                  onSelectPatient={(p) => navigate(`/patients/${p.id}`)}
                  onNewPatient={handleNewPatient}
                  initialFilter="kids"
                  onSelectGroup={(gName) => navigate(`/groups/${encodeURIComponent(gName)}`)}
                />
              }
            />

            <Route
              path="/patients/:id"
              element={
                <PatientDetailWrapper
                  patients={patients}
                  onBack={() => navigate('/patients')}
                  onUpdate={handleUpdatePatient}
                />
              }
            />
            {/* NEW GROUP DETAIL ROUTE */}
            <Route
              path="/groups/:groupName"
              element={
                <GroupDetailView
                  groupSessions={groupSessions}
                  onBack={() => navigate('/patients')}
                />
              }
            />

            <Route
              path="/groups"
              element={
                <GroupsDirectory
                  groupSessions={groupSessions}
                  onSelectGroup={(gName) => navigate(`/groups/${encodeURIComponent(gName)}`)}
                  onNewGroup={() => setIsCreateGroupOpen(true)}
                />
              }
            />
            <Route
              path="/sessions"
              element={
                <SessionsManager
                  patients={patients}
                  onUpdatePatient={handleUpdatePatient}
                  filterMode="individual"
                />
              }
            />
            <Route
              path="/sessions/group"
              element={
                <SessionsManager
                  patients={patients}
                  onUpdatePatient={handleUpdatePatient}
                  filterMode="group"
                />
              }
            />
            <Route
              path="/sessions/group-history"
              element={<GroupSessionsHistory sessions={groupSessions} />}
            />

            <Route
              path="/calendar"
              element={
                <CalendarView
                  patients={patients}
                  groupSessions={groupSessions}
                  onNavigate={handleNavigate}
                  onOpenGroupModal={(mode, data) => groupSession.open(data ? undefined : undefined, mode, data)}
                  onOpenSessionModal={() => { }}
                  onOpenQuickAppointment={(mode) => quickAppointment.open(mode)}
                />
              }
            />

            <Route path="/settings" element={<SettingsView />} />
            <Route path="/resources" element={<DocumentationCenter />} />
            <Route path="/reports" element={<ReportsView />} />
            <Route path="/audit" element={<AuditView />} />
            <Route path="/billing" element={<BillingView />} />

            {/* CATCH-ALL & LEGACY ROUTES */}
            <Route path="/auth/login" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </AppLayout>

      {/* GLOBAL MODALS */}
      {quickAppointment.isOpen && (
        <QuickAppointmentModal
          mode={quickAppointment.mode}
          patients={patients}
          onClose={() => quickAppointment.close()}
          onSave={handleQuickAppointment}
        />
      )}

      {groupSession.isOpen && (
        <GroupSessionModal
          initialGroupName={groupSession.initialGroupName}
          mode={groupSession.mode}
          initialData={groupSession.data} // FIX: Pass the data to show Edit/Delete UI
          patients={patients} // Pass Full Patient List
          onClose={() => groupSession.close()}
          onSave={handleSaveGroupSession}
        />
      )}

      {isCreateGroupOpen && (
        <CreateGroupModal
          onClose={() => setIsCreateGroupOpen(false)}
          onSave={(name) => {
            setIsCreateGroupOpen(false);
            navigate(`/groups/${encodeURIComponent(name)}`);
          }}
        />
      )}
      <CommandMenu />
    </ErrorBoundary>
  );
}

interface PatientDetailWrapperProps {
  patients: Patient[];
  onBack: () => void;
  onUpdate: (updated: Patient) => void;
}

const PatientDetailWrapper: React.FC<PatientDetailWrapperProps> = ({ patients, onBack, onUpdate }) => {
  const { id } = useParams();
  const patient = patients.find((p) => String(p.id) === id);
  if (!patient) return <div className="text-center p-10">Paciente no encontrado</div>;
  return (
    <PatientDetail
      patient={patient}
      onBack={onBack}
      onUpdate={onUpdate}
    />
  );
};

export default App;
