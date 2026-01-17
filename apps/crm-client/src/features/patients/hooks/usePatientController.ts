import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useActivityLog } from '../../../hooks/useActivityLog';
import { useDeletePatient } from '../../../api/queries';
import { useCreateSession, useUpdateSession, useDeleteSession } from '../../../api/mutations/useSessionMutations';
import { Patient, Session, CognitiveScores } from '../../../lib/types';
import { Activity, BarChart3, ClipboardCheck, DollarSign, CheckSquare, Folder } from 'lucide-react';

interface UsePatientControllerProps {
    patient: Patient;
    onUpdate: (patient: Patient) => void;
    onBack: () => void;
}

export const usePatientController = ({ patient, onUpdate, onBack }: UsePatientControllerProps) => {
    const { logActivity } = useActivityLog();
    const { canDelete, canViewFinancials, isPremium, demoMode } = useAuth();

    // UI State
    const [activeTab, setActiveTab] = useState('treatment');
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | undefined>(undefined);
    const [showCognitiveModal, setShowCognitiveModal] = useState(false);
    const [cognitiveInitialTab, setCognitiveInitialTab] = useState<'general' | 'moca' | 'mmse'>('general');
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [showAdmissionChecklist, setShowAdmissionChecklist] = useState(false);

    // Notifications
    const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Mutations
    const { mutate: deletePatient, isPending: isDeleting } = useDeletePatient(demoMode);
    const { mutateAsync: createSession } = useCreateSession();
    const { mutateAsync: updateSession } = useUpdateSession();
    const { mutateAsync: deleteSession } = useDeleteSession();

    // Handlers
    const handleDeletePatient = useCallback(() => {
        if (!patient.id) return;
        deletePatient(String(patient.id), {
            onSuccess: () => {
                logActivity('delete', `Paciente eliminado permanentemente: ${patient.name}`);
                showToast('Paciente eliminado correctamente', 'success');
                onBack();
            },
            onError: (err) => {
                console.error(err);
                showToast('Error al eliminar paciente', 'error');
            }
        });
    }, [patient.id, patient.name, deletePatient, logActivity, onBack, showToast]);

    const handleDeleteSession = useCallback(async (sessionId: string | number) => {
        try {
            if (patient.id) {
                await deleteSession({ patientId: String(patient.id), sessionId: String(sessionId) });
                logActivity('session', `Sesión eliminada de historial: ${patient.name}`);
                showToast('Sesión eliminada correctamente', 'success');
                setShowSessionModal(false);
                return true;
            }
        } catch (e) {
            console.error('Delete Error:', e);
            return false;
        }
        return false;
    }, [patient.id, patient.name, deleteSession, logActivity, showToast]);

    const handleSaveSession = useCallback(async (sessionData: Session | Partial<Session>) => {
        const isNew = !selectedSession;
        try {
            if (isNew) {
                if (patient.id) {
                    await createSession({ patientId: String(patient.id), session: sessionData as Session });
                    if (sessionData.isAbsent) {
                        logActivity('session', `Ausencia registrada por ${patient.name}`);
                    } else {
                        logActivity('session', `Sesión completada con ${patient.name}`);
                    }
                }
            } else {
                if (patient.id && sessionData.id) {
                    await updateSession({ patientId: String(patient.id), sessionId: String(sessionData.id), data: sessionData });
                    if (sessionData.paid) {
                        logActivity('finance', `Pago registrado: Sesión de ${patient.name}`);
                    } else if (sessionData.isAbsent) {
                        logActivity('session', `Sesión marcada como AUSENCIA: ${patient.name}`);
                    } else {
                        logActivity('session', `Sesión actualizada: ${patient.name}`);
                    }
                }
            }
            setShowSessionModal(false);
            showToast('Sesión guardada correctamente', 'success');
            return true;
        } catch (e) {
            console.error('Save Error:', e);
            showToast('Error al guardar sesión', 'error');
            return false;
        }
    }, [selectedSession, patient.id, patient.name, createSession, updateSession, logActivity, showToast]);

    const handleUpdateCognitive = useCallback((data: CognitiveScores & { functionalScores?: number[] }) => {
        onUpdate({
            ...patient,
            cognitiveScores: { ...patient.cognitiveScores, ...data },
            currentEval: data.functionalScores,
        });
        setShowCognitiveModal(false);
        setCognitiveInitialTab('general');
        showToast('Evaluación actualizada', 'success');
    }, [patient, onUpdate, showToast]);

    // Centralized Data Processing
    const activeSessions = useMemo(() => {
        return [...(patient.sessions || [])].sort((a, b) => {
            const parseDate = (dStr: string) => {
                if (!dStr) return 0;
                if (dStr.includes('/')) {
                    const [d, m, y] = dStr.split('/');
                    return new Date(`${y}-${m}-${d}`).getTime();
                }
                return new Date(dStr).getTime();
            };
            return parseDate(b.date) - parseDate(a.date);
        });
    }, [patient.sessions]);

    // Tabs Config
    const tabs = [
        { id: 'treatment', label: 'Plan de Tratamiento', icon: Activity },
        { id: 'evaluation', label: 'Evaluación (0-3)', icon: BarChart3 },
        { id: 'sessions', label: 'Bitácora', icon: ClipboardCheck },
        { id: 'documents', label: 'Gestor Documental', icon: Folder },
        ...(canViewFinancials ? [{ id: 'billing', label: 'Facturación', icon: DollarSign }] : []),
        { id: 'discharge', label: 'Alta y Continuidad', icon: CheckSquare },
    ];

    return {
        activeTab, setActiveTab,
        showSessionModal, setShowSessionModal,
        selectedSession, setSelectedSession,
        showCognitiveModal, setShowCognitiveModal,
        cognitiveInitialTab, setCognitiveInitialTab,
        showGuideModal, setShowGuideModal,
        showEditProfile, setShowEditProfile,
        showReportModal, setShowReportModal,
        showPaywall, setShowPaywall,
        showAdmissionChecklist, setShowAdmissionChecklist,
        isDeleting,
        canDelete,
        isPremium,
        tabs,
        // Computed Data
        activeSessions,
        // Methods
        handleDeletePatient,
        handleDeleteSession,
        handleSaveSession,
        handleUpdateCognitive,
        notification, // Export notification state
        showToast     // Export trigger if needed
    };
};
