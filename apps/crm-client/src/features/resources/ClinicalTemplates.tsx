import { FileText, Printer } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const RESOURCES = [
    { id: 'moca', title: 'MoCA - Evaluación Cognitiva Montreal', description: 'Screening de deterioro cognitivo leve y demencia.', color: 'indigo' },
    { id: 'mmse', title: 'MMSE - Mini-Mental State Examination', description: 'Evaluación rápida del estado cognitivo.', color: 'blue' },
    { id: 'gds', title: 'GDS - Escala Yesavage (15 Ítems)', description: 'Screening de depresión geriátrica.', color: 'emerald' },
];

export const ClinicalTemplates = () => {
    // External PDF Handlers (Local)
    const handlePrintMoca = () => {
        window.open('/resources/moca.pdf', '_blank');
    };
    const handlePrintMmse = () => {
        window.open('/resources/minimental.pdf', '_blank');
    };
    const handlePrintGds = () => {
        window.open('/resources/gds.pdf', '_blank');
    };

    const printActions: Record<string, () => void> = {
        'moca': handlePrintMoca,
        'mmse': handlePrintMmse,
        'gds': handlePrintGds
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {RESOURCES.map(res => (
                    <div
                        key={res.id}
                        // Removed fixed height h-[200px] to prevent overlapping. min-h ensures consistent look.
                        className={`group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-${res.color}-200 transition-all flex flex-col justify-between min-h-[220px]`}
                    >
                        <div>
                            <div className={`w-12 h-12 rounded-xl bg-${res.color}-50 text-${res.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <FileText size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">{res.title}</h3>
                            <p className="text-sm text-slate-500">{res.description}</p>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                            <Button
                                className="w-full"
                                variant="secondary"
                                icon={Printer}
                                onClick={() => printActions[res.id] && printActions[res.id]()}
                            >
                                {res.id.startsWith('manual_') ? 'Descargar Manual' : 'Abrir PDF Online'}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
