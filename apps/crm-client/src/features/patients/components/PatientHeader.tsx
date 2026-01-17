import React, { useState } from 'react';
import { ArrowLeft, CalendarPlus, FileText, Lightbulb, Phone, Trash2, Edit } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { PatientAvatar } from '../../../components/ui/PatientAvatar';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { Patient } from '../../../lib/types'; // Import PATHOLOGY_MAP if needed or pass as prop
import { PATHOLOGY_MAP } from '../../../lib/patientUtils';
import { useActivityLog } from '../../../hooks/useActivityLog';
import { Toast } from '../../../components/ui/Toast';

interface PatientHeaderProps {
    patient: Patient;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
    canDelete: boolean;
    onNewSession: () => void;
    onShowReport: () => void;
    onShowGuide: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
    patient,
    onBack,
    onEdit,
    onDelete,
    isDeleting,
    canDelete,
    onNewSession,
    onShowReport,
    onShowGuide
}) => {
    const { logActivity } = useActivityLog();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'error' } | null>(null);

    return (
        <div className="space-y-6">
            {toast && (
                <Toast
                    message={toast.msg}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <button
                    className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
                    onClick={onBack}
                >
                    <ArrowLeft size={18} /> Volver al Directorio
                </button>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant="primary"
                        size="sm"
                        icon={CalendarPlus}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                        onClick={onNewSession}
                    >
                        AGENDAR CITA
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        icon={FileText}
                        onClick={onShowReport}
                    >
                        Informe
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={Lightbulb}
                        onClick={onShowGuide}
                    >
                        Guía
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600"
                        icon={Phone}
                        onClick={() => {
                            const targetPhone = patient.contact || patient.caregiverPhone;
                            if (targetPhone) {
                                window.location.href = `tel:${targetPhone.replace(/\s/g, '')}`;
                                logActivity('system', `Llamada iniciada con ${patient.name}`);
                            } else {
                                setToast({ msg: 'No hay teléfono registrado', type: 'error' });
                            }
                        }}
                    >
                        Llamar
                    </Button>
                    {canDelete && (
                        <Button
                            variant="danger"
                            size="sm"
                            icon={Trash2}
                            onClick={() => setShowDeleteModal(true)}
                            disabled={isDeleting}
                        >
                            Eliminar Paciente
                        </Button>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={onDelete}
                title="¿Eliminar Paciente?"
                message={`Esta acción eliminará permanentemente a ${patient.name} y todo su historial clínico, sesiones y documentos. Esta acción NO se puede deshacer.`}
                confirmLabel={isDeleting ? 'Eliminando...' : 'Sí, Eliminar Definitivamente'}
                isLoading={isDeleting}
            />

            <Card noPadding className="overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900"></div>
                <div className="px-4 md:px-8 pb-8">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-end -mt-10 text-center md:text-left">
                        <div className="relative">
                            <div className="p-1.5 bg-white rounded-full">
                                <PatientAvatar photo={patient.photo} name={patient.name} size="xl" />
                            </div>
                        </div>
                        <div className="flex-1 pb-2">
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                {patient.name}
                                <button
                                    onClick={onEdit}
                                    className="text-slate-400 hover:text-pink-600 transition-colors"
                                >
                                    <Edit size={20} />
                                </button>
                            </h1>
                            <p className="text-slate-500 font-medium">{PATHOLOGY_MAP[patient.diagnosis] || patient.diagnosis}</p>
                        </div>
                        <div className="flex gap-4 pb-4">
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase">Edad</p>
                                <p className="text-sm font-bold text-slate-700">{patient.age} años</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase">Ingreso</p>
                                <p className="text-sm font-bold text-slate-700">{patient.joinedDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
