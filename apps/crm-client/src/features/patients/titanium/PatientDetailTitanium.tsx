import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatientController } from '../../../hooks/controllers/usePatientController';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { PatientHeader } from './components/PatientHeader';
import { ClinicalSummaryCard } from './components/ClinicalSummaryCard';
import { SessionTimeline } from './components/SessionTimeline';
import { FinancialOverview } from './components/FinancialOverview';

export const PatientDetailTitanium: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // THE BRAIN: Headless Controller
    const {
        patient,
        isLoading,
        isError,
        error,
        stats
    } = usePatientController(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
        );
    }

    if (isError || !patient) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
                <h2 className="text-xl font-semibold text-red-600">Error al cargar paciente</h2>
                <p className="text-slate-500">{String(error)}</p>
                <Button onClick={() => navigate('/dashboard/patients')}>Volver</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-500">
            {/* TOP BAR */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver
                </Button>
                <h1 className="text-lg font-semibold text-slate-800">Expediente Clínico (Titanium Preview)</h1>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* ATOMIC BODY PARTS */}
                <PatientHeader patient={patient} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* LEFT COLUMN: HISTORY & SUMMARY */}
                    <div className="md:col-span-2 space-y-6">
                        <ClinicalSummaryCard patient={patient} />

                        <SessionTimeline
                            sessions={patient.sessions}
                            onAddSession={() => { }} // TODO: Connect to explicit modal if needed, or rely on existing floating button
                        />
                    </div>

                    {/* RIGHT COLUMN: FINANCES & ASSETS */}
                    <div className="space-y-6">
                        <FinancialOverview stats={stats} />

                        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h3 className="text-lg font-medium mb-4">Documentos</h3>
                            <p className="text-slate-500 italic">Próximamente...</p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};
