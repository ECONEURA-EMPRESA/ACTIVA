import React, { lazy } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { Patient, GroupSession, NavigationPayload } from '../lib/types';

// LAZY IMPORTS
const DashboardView = lazy(() => import('@/features/dashboard/DashboardView').then(m => ({ default: m.DashboardView })));
const PatientsDirectory = lazy(() => import('@/features/patients/PatientsDirectory').then(m => ({ default: m.PatientsDirectory })));
const PatientDetail = lazy(() => import('../features/patients/PatientDetail').then(m => ({ default: m.PatientDetail })));
const SessionsManager = lazy(() => import('../features/sessions/SessionsManager').then(m => ({ default: m.SessionsManager })));
const GroupSessionsHistory = lazy(() => import('../features/sessions/GroupSessionsHistory').then(m => ({ default: m.GroupSessionsHistory })));
const CalendarView = lazy(() => import('../features/sessions/CalendarView').then(m => ({ default: m.CalendarView })));
const SettingsView = lazy(() => import('../features/settings/SettingsView').then(m => ({ default: m.SettingsView })));
const DocumentationCenter = lazy(() => import('../features/resources/DocumentationCenter').then(m => ({ default: m.DocumentationCenter })));
const AuditView = lazy(() => import('../features/settings/AuditView').then(m => ({ default: m.AuditView })));
const ReportsView = lazy(() => import('../features/reports/ReportsView').then(m => ({ default: m.ReportsView })));
const BillingView = lazy(() => import('../features/billing/BillingView').then(m => ({ default: m.BillingView })));
const GroupDetailView = lazy(() => import('../features/patients/GroupDetailView').then(m => ({ default: m.GroupDetailView })));
const GroupsDirectory = lazy(() => import('../features/patients/GroupsDirectory').then(m => ({ default: m.GroupsDirectory })));

// WRAPPERS
import { useParams } from 'react-router-dom';

const PatientDetailWrapper: React.FC<{ patients: Patient[]; onBack: () => void; onUpdate: (p: Patient) => void }> = ({ patients, onBack, onUpdate }) => {
    const { id } = useParams();
    const patient = patients.find((p) => String(p.id) === id);
    if (!patient) return <div className="text-center p-10">Paciente no encontrado</div>;
    return <PatientDetail patient={patient} onBack={onBack} onUpdate={onUpdate} />;
};

interface AppRoutesProps {
    patients: Patient[];
    groupSessions: GroupSession[];
    onNavigate: (view: string, data?: NavigationPayload) => void;
    onUpdatePatient: (patient: Patient) => void;
    onNewPatient: (data: Omit<Patient, 'id'>) => void;
    onNewGroup: () => void;
    handleSaveGroupSession?: (data: GroupSession) => void;
    // UI Store Actions passed down as prop handlers for specific routes if needed
    onOpenGroupModal: (mode: 'schedule' | 'evolution', data?: GroupSession) => void;
    onOpenQuickAppointment: (mode: 'new' | 'existing') => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
    patients,
    groupSessions,
    onNavigate,
    onUpdatePatient,
    onNewPatient,
    onNewGroup,
    onOpenGroupModal,
    onOpenQuickAppointment
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
                path="/dashboard"
                element={
                    <PageTransition>
                        <DashboardView patients={patients} onViewChange={onNavigate} />
                    </PageTransition>
                }
            />

            <Route
                path="/patients"
                element={
                    <PageTransition>
                        <PatientsDirectory
                            patients={patients}
                            groupSessions={groupSessions}
                            onSelectPatient={(p: Patient) => navigate(`/patients/${p.id}`)}
                            onSelectGroup={(gName: string) => navigate(`/groups/${encodeURIComponent(gName)}`)}
                            onNewPatient={onNewPatient}
                            initialFilter="all"
                        />
                    </PageTransition>
                }
            />
            <Route
                path="/patients/adults"
                element={
                    <PatientsDirectory
                        patients={patients}
                        groupSessions={groupSessions}
                        onSelectPatient={(p: Patient) => navigate(`/patients/${p.id}`)}
                        onNewPatient={onNewPatient as (p: Partial<Patient>) => void}
                        initialFilter="adults"
                        onSelectGroup={(gName: string) => navigate(`/groups/${encodeURIComponent(gName)}`)}
                    />
                }
            />
            <Route
                path="/patients/kids"
                element={
                    <PatientsDirectory
                        patients={patients}
                        groupSessions={groupSessions}
                        onSelectPatient={(p: Patient) => navigate(`/patients/${p.id}`)}
                        onNewPatient={onNewPatient as (p: Partial<Patient>) => void}
                        initialFilter="kids"
                        onSelectGroup={(gName: string) => navigate(`/groups/${encodeURIComponent(gName)}`)}
                    />
                }
            />

            <Route
                path="/patients/:id"
                element={
                    <PageTransition>
                        <PatientDetailWrapper
                            patients={patients}
                            onBack={() => navigate('/patients')}
                            onUpdate={onUpdatePatient}
                        />
                    </PageTransition>
                }
            />

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
                        onNewGroup={onNewGroup}
                    />
                }
            />
            <Route
                path="/sessions"
                element={
                    <SessionsManager
                        patients={patients}
                        onUpdatePatient={onUpdatePatient}
                        filterMode="individual"
                    />
                }
            />
            <Route
                path="/sessions/group"
                element={
                    <SessionsManager
                        patients={patients}
                        groupSessions={groupSessions}
                        onUpdatePatient={onUpdatePatient}
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
                    <PageTransition>
                        <CalendarView
                            patients={patients}
                            groupSessions={groupSessions}
                            onNavigate={onNavigate}
                            onOpenGroupModal={onOpenGroupModal}
                            onOpenSessionModal={() => { }}
                            onOpenQuickAppointment={onOpenQuickAppointment}
                        />
                    </PageTransition>
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
    );
};
