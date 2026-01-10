import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FileText, Printer } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MmseTemplate } from './templates/MmseTemplate';
import { MocaTemplate } from './templates/MocaTemplate';
import { GdsTemplate } from './templates/GdsTemplate';

const RESOURCES = [
    { id: 'moca', title: 'MoCA - Evaluación Cognitiva Montreal', description: 'Screening de deterioro cognitivo leve y demencia.', color: 'indigo' },
    { id: 'mmse', title: 'MMSE - Mini-Mental State Examination', description: 'Evaluación rápida del estado cognitivo.', color: 'blue' },
    { id: 'gds', title: 'GDS - Escala Yesavage (15 Ítems)', description: 'Screening de depresión geriátrica.', color: 'emerald' },
];

export const ClinicalTemplates = () => {
    // Refs for printing
    const mocaRef = useRef<HTMLDivElement>(null);
    const mmseRef = useRef<HTMLDivElement>(null);
    const gdsRef = useRef<HTMLDivElement>(null);

    // Print Handlers
    const handlePrintMoca = useReactToPrint({
        content: () => mocaRef.current,
        documentTitle: 'MoCA_Evaluacion_Cognitiva'
    } as any); // Titanium: Library type definition mismatch for 'content'
    const handlePrintMmse = useReactToPrint({
        content: () => mmseRef.current,
        documentTitle: 'MMSE_Mini_Mental'
    } as any);
    const handlePrintGds = useReactToPrint({
        content: () => gdsRef.current,
        documentTitle: 'GDS_Escala_Yesavage'
    } as any);

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
                        className={`group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-${res.color}-200 transition-all flex flex-col justify-between h-[200px]`}
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
                                Imprimir Plantilla
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Off-screen Templates for Print Rendering (Titanium Style: No Inline) */}
            <div className="absolute -top-[10000px] -left-[10000px]">
                <MocaTemplate ref={mocaRef} />
                <MmseTemplate ref={mmseRef} />
                <GdsTemplate ref={gdsRef} />
            </div>
        </div>
    );
};
