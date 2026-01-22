import React, { useState, Suspense } from 'react';
// Loader2 removed
import { useNavigate, useLocation } from 'react-router-dom';

// LAYOUT & THEME

import { AppLayout } from '@/layout/AppLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// AUTH
import { AnimatePresence } from 'framer-motion'; // TITANIUM ANIMATION
import { LoginView } from '@/auth/LoginView';
import { useFirebaseAuthState as useAuth } from '@/auth/useAuth';

// ROUTES
import { AppRoutes } from './routes/AppRoutes';

// MODALS

// MODALS
import { QuickAppointmentModal } from './features/sessions/modals/QuickAppointmentModal';
import { CreateGroupModal } from './features/patients/modals/CreateGroupModal';
import { GroupSessionModal } from './features/sessions/modals/GroupSessionModal';
import { SessionRepository } from './data/repositories/SessionRepository';
import { CommandMenu } from './components/ui/CommandMenu';
// STORES
import { useUIStore } from './stores/useUIStore';

// API & TYPES
import { Patient, GroupSession, CalendarEvent, NavigationPayload, Session } from './lib/types';

// Loading Spinner for Code Splitting Suspense
import { OfflineIndicator } from './components/ui/OfflineIndicator';
// PremiumSplash removed per user request
import { ReloadPrompt } from './components/ui/ReloadPrompt';
import { PWAInstallPrompt } from './features/pwa/PWAInstallPrompt';

const PageLoader = () => <div className="h-screen w-full flex items-center justify-center bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-pink-500 animate-spin" /></div>;

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
  const { user, demoMode, enterDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // GLOBAL STATE (Server State via React Query)
  const { data: patients = [] } = usePatients(demoMode || !user);

  // MUTATIONS
  const createPatient = useCreatePatient(demoMode);
  const updatePatient = useUpdatePatient(demoMode);



  // UI STORE (ZUSTAND - TITANIUM ARCHITECTURE)
  const quickAppointment = useUIStore((state) => state.quickAppointment);
  const groupSession = useUIStore((state) => state.groupSession);

  // isLoadingData removed (unused)

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

  const handleSaveGroupSession = async (data: GroupSession) => {

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
        const linkedParticipants = data.participants.filter((p) => p.id); // Only those with IDs

        if (linkedParticipants.length > 0) {


          // We iterate and create individual sessions
          // Ideally this should be a Batch, but for now concurrent promises is fine for Beta.
          const syncPromises = linkedParticipants.map(async (p) => {
            const individualSessionPayload = {
              date: data.date,
              id: `GS-${data.id}-${p.id}`,
              type: 'group' as const,
              groupName: data.groupName,
              groupId: data.id,
              notes: `Sesión Grupal: ${data.groupName}. ${data.observations || ''}`,
              price: Math.round(Number(data.price) / (data.participants?.length || 1)),
              paid: false,
              billable: true,
              isAbsent: false,
              activities: data.activities || [],
            };
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
  const handleNavigate = (viewId: string, data?: NavigationPayload) => {
    // State driven by URL

    // TITANIUM: Native View Transitions
    if (!document.startViewTransition) {
      processNavigation();
      return;
    }

    document.startViewTransition(() => {
      processNavigation();
    });

    function processNavigation() {
      switch (viewId) {
        case 'dashboard':
          navigate('/dashboard');
          break;
        case 'patients':
          // Check if data has mode 'new' 
          if (data && typeof data === 'object' && 'mode' in data && data.mode === 'new') {
            // Logic to open new patient modal handled by route param ?action=new if desired, 
            // but for now likely handled by internal state or query param.
            // Using query param is cleaner:
            navigate('/patients?action=new');
          } else {
            navigate('/patients');
          }
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
          if (typeof data === 'string' || typeof data === 'number') {
            navigate(`/patients/${data}`);
          } else if (data && typeof data === 'object' && 'id' in data) {
            navigate(`/patients/${data.id}`);
          }
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
    }
  };

  // LOGGING HOOK
  const { logActivity } = useActivityLog();

  // HANDLERS (REACT QUERY MUTATIONS)
  const handleUpdatePatient = async (updatedPatient: Patient) => {
    updatePatient.mutate(updatedPatient, {
      onSuccess: () => {
        logActivity('patient', `Paciente actualizado: ${updatedPatient.name}`);
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
        }
      });
    } else {
      const patient = patients.find((p) => p.id == data.patientId);
      if (patient && patient.id) {
        const updatedSessions = [{ id: Date.now().toString(), ...newSessionBase }, ...(patient.sessions || [])];
        const updatedPatient = { ...patient, sessions: updatedSessions } as Patient;

        SessionRepository.create(String(patient.id), newSessionBase as unknown as Session)
          .then(() => { })
          .catch(err => console.error("Titanium Sync Error:", err));

        updatePatient.mutate(updatedPatient, {
          onSuccess: () => logActivity('session', `Cita rápida creada para ${patient.name}`)
        });
      }
    }
    quickAppointment.close();
  };



  const events: CalendarEvent[] = React.useMemo(() => {
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

  // UNIFIED LOADING STATE REMOVED - INSTANT ACCESS
  if (!user && !demoMode) {
    return (
      <>
        <LoginView onDemoLogin={enterDemoMode} />
      </>
    );
  }

  // isLoadingData check removed from here as it's handled above

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
          <ReloadPrompt />


          <AnimatePresence mode="wait">
            <AppRoutes
              patients={patients}
              groupSessions={groupSessions}
              onNavigate={handleNavigate}
              onUpdatePatient={handleUpdatePatient}
              onNewPatient={handleNewPatient}
              onNewGroup={() => setIsCreateGroupOpen(true)}
              onOpenGroupModal={(mode, data) => groupSession.open(data ? undefined : undefined, mode, data)}
              onOpenQuickAppointment={(mode) => quickAppointment.open(mode)}
            />
          </AnimatePresence>
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
      <OfflineIndicator />
      <PWAInstallPrompt />
    </ErrorBoundary>
  );
}

export default App;


