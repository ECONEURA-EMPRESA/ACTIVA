import React from 'react';
import { Patient, ClinicSettings, Session } from '../../lib/types';
import { usePatientController } from './hooks/usePatientController';
import { PatientHeader } from './components/PatientHeader';
import { Toast } from '../../components/ui/Toast';
import { PaywallModal } from '../../components/ui/PaywallModal';

// Tabs
import { TreatmentTab } from './components/tabs/TreatmentTab';
import { EvaluationTab } from './components/tabs/EvaluationTab';
import { ClinicalHistoryTab } from './components/tabs/ClinicalHistoryTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import { BillingTab } from './components/tabs/BillingTab';
import { DischargeTab } from './components/tabs/DischargeTab';

// Modals
import { SessionModal } from './modals/SessionModal';
import { CognitiveModal } from './modals/CognitiveModal';
import { ClinicalGuideModal } from './modals/ClinicalGuideModal';
import { EditProfileModal } from './modals/EditProfileModal';
import { ReportModal } from './modals/ReportModal';
import { AdmissionChecklistModal } from './modals/AdmissionChecklistModal';

// Alert Banner Components (Still local as it's just a view part)
import { ShieldCheck } from 'lucide-react';
import { useSettingsController } from '../../hooks/controllers/useSettingsController';

interface PatientDetailProps {
    patient: Patient;
    onBack: () => void;
    onUpdate: (updated: Patient) => void;
}

import { SignatureModal } from './modals/SignatureModal';
import { useDocumentController } from '../../hooks/controllers/useDocumentController';
import { useClinicalReport } from './hooks/useClinicalReport';

import { RecycleBinModal } from './modals/RecycleBinModal';

export const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack, onUpdate }) => {
    const { generateReport } = useClinicalReport();
    const { settings: clinicSettings } = useSettingsController(); // Need settings for Reports/Billing
    const { uploadDocument } = useDocumentController(String(patient.id)); // Signature Upload
    const [showSignatureModal, setShowSignatureModal] = React.useState(false); // Signature State
    const [showRecycleBin, setShowRecycleBin] = React.useState(false); // Recycle Bin State

    const handleSaveSignature = async (signatureDataUrl: string) => {
        try {
            const res = await fetch(signatureDataUrl);
            const blob = await res.blob();
            const file = new File([blob], `Consentimiento_Firmado_${new Date().toISOString().split('T')[0]}.png`, { type: 'image/png' });
            await uploadDocument(file);
            // Toast handled by controller usually, or add manual
        } catch (e) {
            console.error(e);
        }
    };

    const {
        activeTab, setActiveTab,
        tabs,
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
        activeSessions,
        deletedSessions,
        notification,
        handleDeletePatient,
        handleDeleteSession,
        handleRestoreSession,
        handleSaveSession,
        handleUpdateCognitive,
        showToast
    } = usePatientController({ patient, onUpdate, onBack });

    // Critical Alerts Logic (View Logic)
    const highRisks = patient.safetyProfile
        ? Object.entries(patient.safetyProfile)
            .filter(([k, v]) => v === true && ['epilepsy', 'dysphagia', 'flightRisk', 'psychomotorAgitation', 'chokingHazard'].includes(k))
            .map(([k]) => k)
        : [];
    const isoNocivo = patient.musicalIdentity?.dislikes?.length || 0;

    return (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 max-w-7xl mx-auto">
            {notification && (
                <Toast message={notification.msg} type={notification.type} onClose={() => { /* Handled by hook timeout */ }} />
            )}

            {/* --- CRITICAL ALERTS BANNER --- */}
            {(highRisks.length > 0 || isoNocivo > 0) && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex items-start gap-4 w-full md:w-auto">
                        <div className="p-2 bg-red-100 rounded-full text-red-600 shrink-0"><ShieldCheck size={24} /></div>
                        <div className="flex-1">
                            <h3 className="font-bold text-red-800 flex items-center gap-2 text-sm md:text-base">ALERTA DE SEGURIDAD CLÍNICA</h3>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {highRisks.map(r => (
                                    <span key={r} className="px-2 py-0.5 bg-red-200 text-red-800 text-[10px] md:text-xs font-bold rounded uppercase">{r}</span>
                                ))}
                                {isoNocivo > 0 && <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-[10px] md:text-xs font-bold rounded">ISO NOCIVO ACTIVO</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- HEADER --- */}
            <PatientHeader
                patient={patient}
                onBack={onBack}
                onEdit={() => setShowEditProfile(true)}
                onDelete={handleDeletePatient}
                isDeleting={isDeleting}
                canDelete={canDelete}
                onNewSession={() => { setSelectedSession(undefined); setShowSessionModal(true); }}
                onShowReport={() => setShowReportModal(true)}
                onShowGuide={() => setShowGuideModal(true)}
                onExport={() => generateReport(patient)}
                onSign={() => setShowSignatureModal(true)}
                onShowRecycleBin={() => setShowRecycleBin(true)}
                recycleBinCount={deletedSessions?.length || 0}
            />


            {showSignatureModal && (
                <SignatureModal
                    isOpen={showSignatureModal}
                    onClose={() => setShowSignatureModal(false)}
                    onSave={handleSaveSignature}
                />
            )}

            <RecycleBinModal
                isOpen={showRecycleBin}
                onClose={() => setShowRecycleBin(false)}
                deletedSessions={deletedSessions}
                onRestore={handleRestoreSession}
            />
            {/* --- TABS NAV --- */}
            <div className="border-b border-slate-200 sticky top-0 bg-[#F8FAFC]/95 backdrop-blur-sm z-10 pt-2 md:pt-4">
                <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar px-4 md:px-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 flex items-center gap-2 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-pink-600' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <tab.icon size={18} /> {tab.label}
                            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 rounded-t-full" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="min-h-[400px]">
                {activeTab === 'treatment' && <TreatmentTab patient={patient} onUpdate={onUpdate} />}
                {activeTab === 'evaluation' && (
                    <EvaluationTab
                        patient={patient}
                        onOpenCognitive={() => setShowCognitiveModal(true)}
                    />
                )}
                {activeTab === 'sessions' && (
                    <ClinicalHistoryTab
                        patient={patient}
                        activeSessions={activeSessions}
                        isPremium={isPremium}
                        onShowPaywall={() => setShowPaywall(true)}
                        onNewSession={() => { setSelectedSession(undefined); setShowSessionModal(true); }}
                        onEditSession={(s) => { setSelectedSession(s); setShowSessionModal(true); }}
                        onDeleteSession={handleDeleteSession}
                        onCloneSession={(s) => {
                            const cloned = { ...s, id: 'new_clone', date: new Date().toISOString(), paid: false, isAbsent: false };
                            setSelectedSession(cloned as unknown as Session);
                            setShowSessionModal(true);
                            showToast('Sesión duplicada (modo edición)', 'success');
                        }}
                    />
                )}
                {activeTab === 'documents' && <DocumentsTab />}
                {activeTab === 'billing' && (
                    <BillingTab
                        patient={patient}
                        activeSessions={activeSessions}
                        onUpdate={onUpdate}
                        clinicSettings={clinicSettings || ({} as ClinicSettings)}
                    />
                )}
                {activeTab === 'discharge' && (
                    <DischargeTab
                        patient={patient}
                        onBack={onBack}
                        onShowAdmission={() => setShowAdmissionChecklist(true)}
                        onShowReport={() => setShowReportModal(true)}
                    />
                )}
            </div>

            {/* --- MODALS --- */}
            {
                showSessionModal && (
                    <SessionModal
                        initialData={selectedSession}
                        patientType={patient.pathologyType || 'other'}
                        onClose={() => setShowSessionModal(false)}
                        onSave={handleSaveSession}
                        onDelete={handleDeleteSession}
                    />
                )
            }
            {
                showCognitiveModal && (
                    <CognitiveModal
                        onClose={() => { setShowCognitiveModal(false); setCognitiveInitialTab('general'); }}
                        onSave={handleUpdateCognitive}
                        initialData={patient.cognitiveScores}
                        initialScores={patient.currentEval}
                        initialTab={cognitiveInitialTab}
                        isChild={patient.age < 15}
                        isGeriatric={patient.age >= 60}
                    />
                )
            }
            {showGuideModal && <ClinicalGuideModal onClose={() => setShowGuideModal(false)} />}
            {
                showEditProfile && (
                    <EditProfileModal
                        onClose={() => setShowEditProfile(false)}
                        onSave={(data) => { onUpdate({ ...patient, ...data }); setShowEditProfile(false); showToast('Perfil actualizado', 'success'); }}
                        initialData={patient}
                    />
                )
            }
            {
                showReportModal && (
                    <ReportModal
                        isOpen={showReportModal}
                        onClose={() => setShowReportModal(false)}
                        patient={patient}
                        clinicSettings={clinicSettings || {}}
                    />
                )
            }
            {
                showAdmissionChecklist && (
                    <AdmissionChecklistModal
                        onClose={() => setShowAdmissionChecklist(false)}
                        onSave={(data) => {
                            onUpdate({ ...patient, cognitiveScores: { ...patient.cognitiveScores, admissionChecks: data } });
                            setShowAdmissionChecklist(false);
                            showToast('Checklist guardado', 'success');
                        }}
                        initialData={patient.cognitiveScores?.admissionChecks}
                        isChild={patient.age < 15}
                    />
                )
            }
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} limitType="session" />

            {
                showSignatureModal && (
                    <SignatureModal
                        isOpen={showSignatureModal}
                        onClose={() => setShowSignatureModal(false)}
                        onSave={handleSaveSignature}
                    />
                )
            }
        </div >
    );
};
