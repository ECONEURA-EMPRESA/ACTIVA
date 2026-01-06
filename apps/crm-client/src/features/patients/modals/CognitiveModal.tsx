import React, { useState } from 'react';
import { Brain, X, Activity, Music, Baby } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import {
    EVALUATION_AREAS_ADULT,
    MOCA_SECTIONS,
    MMSE_SECTIONS,
    CHILD_DEV_DOMAINS,
    CHILD_MUSICAL_PROFILE,
    GDS_STAGES,
    CHILD_LEVELS,
} from '../../../lib/constants';
// import { EVALUATION_AREAS } from '../../../lib/clinicalUtils';
// import { CognitiveScores } from '../../../lib/types';
// import { CognitiveRadar } from '../components/CustomerRadar';
import { formatDateForDisplay } from '../../../lib/patientUtils';
import { formatDateForInput } from '../../../lib/utils';

// Helper for GDS in new modal style
const GDSSelector = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-700">Escala GDS</span>
            <span className="text-xl font-black text-indigo-600">{value || '-'}</span>
        </div>
        <select
            className="w-full text-xs p-2 rounded border bg-white"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">- Seleccionar Fase -</option>
            {GDS_STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                    {s.label}
                </option>
            ))}
        </select>
    </div>
);

interface CognitiveModalProps {
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
    initialScores?: number[];
    isChild?: boolean;
    initialTab?: 'general' | 'moca' | 'mmse' | 'admission';
}

export const CognitiveModal: React.FC<CognitiveModalProps> = ({
    onClose,
    onSave,
    initialData,
    initialScores,
    isChild = false,
    initialTab = 'general',
}) => {
    // STARTING TAB LOGIC
    const [activeTab, setActiveTab] = useState<'general' | 'moca' | 'mmse' | 'admission'>(initialTab);
    const [date, setDate] = useState(
        initialData?.date
            ? formatDateForInput(initialData.date)
            : new Date().toISOString().split('T')[0],
    );

    // Adult States
    const [mocaDetails, setMocaDetails] = useState(initialData?.mocaDetails || {});
    const [mmseDetails, setMmseDetails] = useState(initialData?.mmseDetails || {});
    const [gdsValue, setGdsValue] = useState(initialData?.gds || '');
    const [functionalScores, setFunctionalScores] = useState<number[]>(
        initialScores || Array(9).fill(0),
    );

    // Child States
    const [childProfile, setChildProfile] = useState<Record<string, Record<string, number>>>(
        initialData?.childProfile || {},
    );
    const [childObs, setChildObs] = useState(initialData?.childObs || '');

    const mocaTotal = MOCA_SECTIONS.reduce((sum, s) => sum + parseInt(mocaDetails[s.id] || '0'), 0);
    const mmseTotal = MMSE_SECTIONS.reduce((sum, s) => sum + parseInt(mmseDetails[s.id] || '0'), 0);

    // Updates
    const updateChildProfile = (domainId: string, item: string, value: number) => {
        setChildProfile((prev) => ({
            ...prev,
            [domainId]: { ...(prev[domainId] || {}), [item]: value },
        }));
    };

    const handleSave = () => {
        // Child Radar Calculation logic
        let childRadarScores: number[] = [];
        if (isChild) {
            const calculateDomainAvg = (domainId: string, itemList: string[]) => {
                const domainData = childProfile[domainId] || {};
                const values = itemList.map((item) => domainData[item] || 0);
                const sum = values.reduce((a, b) => a + b, 0);
                return values.length > 0 ? Math.round(sum / values.length) : 0;
            };
            childRadarScores = [
                calculateDomainAvg('sensory', CHILD_DEV_DOMAINS[0].items),
                calculateDomainAvg('comm', CHILD_DEV_DOMAINS[1].items),
                calculateDomainAvg('cognitive', CHILD_DEV_DOMAINS[2].items),
                calculateDomainAvg('socio', CHILD_DEV_DOMAINS[3].items),
                calculateDomainAvg('rhythm', CHILD_MUSICAL_PROFILE[0].items), // Simplified for the 5-axis radar
            ];
        }

        onSave({
            date: formatDateForDisplay(date),
            moca: `${mocaTotal}/30`,
            mmse: `${mmseTotal}/30`,
            gds: gdsValue,
            functionalScores: isChild ? childRadarScores : functionalScores,
            mocaDetails,
            mmseDetails,
            childProfile,
            childObs,
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-3d max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
                {/* Header Unificado */}
                <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div
                            className={`p-3 rounded-2xl ${isChild ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600'}`}
                        >
                            {isChild ? <Baby size={28} /> : <Brain size={28} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">
                                {isChild ? 'Perfil de Desarrollo' : 'Valoración Geriátrica'}
                            </h2>
                            <p className="text-slate-500 text-sm font-medium">Evaluación Clínica Integral</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <label className="block text-[10px] font-bold uppercase text-slate-400">
                                Fecha Evaluación
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="font-bold text-slate-700 bg-transparent border-none text-right focus:ring-0 p-0 outline-none w-32"
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 custom-scrollbar">
                    {/* TABS NAVIGATION */}
                    <div className="flex border-b border-slate-200 mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
                        {[
                            { id: 'general', label: isChild ? 'Perfil de Desarrollo' : 'Resumen & Funcional' },
                            ...(isChild
                                ? []
                                : [
                                    { id: 'moca', label: 'MOCA (Detallado)' },
                                    { id: 'mmse', label: 'MMSE (Detallado)' },
                                ]),
                            { id: 'admission', label: 'Admisión / Seguridad' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-pink-50 text-pink-700 border-b-2 border-pink-500' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form
                        id="evalForm"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                        className="space-y-8"
                    >
                        {/* --- VISTA ADULTO: Dashboard Métricas + Funcional --- */}
                        {!isChild && activeTab === 'general' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Columna Izquierda: Métricas Hard (MOCA/MMSE) */}
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                                            <Activity size={18} className="text-pink-500" /> Screening Cognitivo
                                        </h3>

                                        <div className="space-y-6">
                                            {/* MOCA Summary */}
                                            <div
                                                className="bg-slate-50 rounded-xl p-4 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                                                onClick={() => setActiveTab('moca')}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-slate-700">MOCA</span>
                                                    <span className="text-2xl font-black text-pink-600">
                                                        {mocaTotal}
                                                        <span className="text-sm text-slate-400 font-medium">/30</span>
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1 font-medium text-right">
                                                    Ver detalle &rarr;
                                                </div>
                                            </div>

                                            {/* MMSE Summary */}
                                            <div
                                                className="bg-slate-50 rounded-xl p-4 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                                                onClick={() => setActiveTab('mmse')}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-slate-700">MMSE</span>
                                                    <span className="text-2xl font-black text-blue-600">
                                                        {mmseTotal}
                                                        <span className="text-sm text-slate-400 font-medium">/30</span>
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-400 mt-1 font-medium text-right">
                                                    Ver detalle &rarr;
                                                </div>
                                            </div>

                                            {/* GDS Card */}
                                            <GDSSelector value={gdsValue} onChange={setGdsValue} />
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Derecha: Mapa Funcional (Sliders) */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
                                        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
                                            <Activity size={18} className="text-indigo-500" /> Perfil Funcional & Musical
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            {EVALUATION_AREAS_ADULT.map((area, i) => (
                                                <div key={i} className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <label className="text-sm font-bold text-slate-700">{area}</label>
                                                        <span
                                                            className={`text-xs font-bold px-2 py-0.5 rounded ${functionalScores[i] === 3 ? 'bg-emerald-100 text-emerald-700' : functionalScores[i] === 2 ? 'bg-blue-100 text-blue-700' : functionalScores[i] === 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}
                                                        >
                                                            {functionalScores[i] === 0
                                                                ? 'Nulo'
                                                                : functionalScores[i] === 1
                                                                    ? 'Bajo'
                                                                    : functionalScores[i] === 2
                                                                        ? 'Medio'
                                                                        : 'Alto'}
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="3"
                                                        step="1"
                                                        value={functionalScores[i]}
                                                        onChange={(e) => {
                                                            const n = [...functionalScores];
                                                            n[i] = parseInt(e.target.value);
                                                            setFunctionalScores(n);
                                                        }}
                                                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-pink-600"
                                                    />
                                                    <div className="flex justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                        <span>0</span>
                                                        <span>1</span>
                                                        <span>2</span>
                                                        <span>3</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- VISTA MOCA DETALLADO --- */}
                        {!isChild && activeTab === 'moca' && (
                            <div className="animate-in fade-in max-w-2xl mx-auto space-y-6">
                                <div className="flex items-center gap-4 border-b pb-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('general')}
                                        className="p-2 hover:bg-slate-100 rounded-lg"
                                    >
                                        <Activity size={20} />
                                    </button>
                                    <div>
                                        <h3 className="font-black text-slate-800 text-xl">Evaluación MOCA</h3>
                                        <p className="text-sm text-slate-500">Montreal Cognitive Assessment</p>
                                    </div>
                                    <div className="ml-auto text-2xl font-black text-pink-600 bg-pink-50 px-4 py-2 rounded-xl">
                                        {mocaTotal}/30
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {MOCA_SECTIONS.map((s) => (
                                        <div
                                            key={s.id}
                                            className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm"
                                        >
                                            <div className="flex-1">
                                                <label className="font-bold text-slate-700 block">{s.label}</label>
                                                <span className="text-xs text-slate-400">Puntuación máx: {s.max}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={s.max}
                                                    value={mocaDetails[s.id] || ''}
                                                    onChange={(e) =>
                                                        setMocaDetails({
                                                            ...mocaDetails,
                                                            [s.id]: parseInt(e.target.value) || 0,
                                                        })
                                                    }
                                                    className="w-16 h-12 text-center text-xl font-black bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- VISTA MMSE DETALLADO --- */}
                        {!isChild && activeTab === 'mmse' && (
                            <div className="animate-in fade-in max-w-2xl mx-auto space-y-6">
                                <div className="flex items-center gap-4 border-b pb-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('general')}
                                        className="p-2 hover:bg-slate-100 rounded-lg"
                                    >
                                        <Activity size={20} />
                                    </button>
                                    <div>
                                        <h3 className="font-black text-slate-800 text-xl">Evaluación MMSE</h3>
                                        <p className="text-sm text-slate-500">Mini-Mental State Examination</p>
                                    </div>
                                    <div className="ml-auto text-2xl font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
                                        {mmseTotal}/30
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {MMSE_SECTIONS.map((s) => (
                                        <div
                                            key={s.id}
                                            className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm"
                                        >
                                            <div className="flex-1">
                                                <label className="font-bold text-slate-700 block">{s.label}</label>
                                                <span className="text-xs text-slate-400">Puntuación máx: {s.max}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={s.max}
                                                    value={mmseDetails[s.id] || ''}
                                                    onChange={(e) =>
                                                        setMmseDetails({
                                                            ...mmseDetails,
                                                            [s.id]: parseInt(e.target.value) || 0,
                                                        })
                                                    }
                                                    className="w-16 h-12 text-center text-xl font-black bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- VISTA NIÑO: Tarjetas Visuales de Desarrollo --- */}
                        {isChild && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                                {[
                                    ...CHILD_DEV_DOMAINS,
                                    {
                                        id: 'musical',
                                        title: 'Perfil Musical',
                                        icon: Music,
                                        color: 'pink',
                                        items: CHILD_MUSICAL_PROFILE.flatMap((p) => p.items),
                                    },
                                ].map((domain) => {
                                    const DomainIcon = domain.icon;
                                    // Map color names to tailwind classes explicitly
                                    const colorClasses: any = {
                                        blue: 'bg-blue-50 border-blue-100 text-blue-700',
                                        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
                                        purple: 'bg-purple-50 border-purple-100 text-purple-700',
                                        rose: 'bg-rose-50 border-rose-100 text-rose-700',
                                        pink: 'bg-pink-50 border-pink-100 text-pink-700',
                                    };

                                    return (
                                        <div
                                            key={domain.id}
                                            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
                                        >
                                            <div
                                                className={`p-4 border-b border-slate-100 flex items-center gap-3 ${colorClasses[domain.color]}`}
                                            >
                                                <DomainIcon size={20} />
                                                <h3 className="font-bold text-lg">{domain.title}</h3>
                                            </div>
                                            <div className="p-5 space-y-5">
                                                {domain.items.map((item) => {
                                                    // Handle musical profile structure flattening or direct access
                                                    const domKey =
                                                        domain.id === 'musical'
                                                            ? CHILD_MUSICAL_PROFILE.find((cat) => cat.items.includes(item))?.id ||
                                                            'rhythm'
                                                            : domain.id;

                                                    const currentVal = childProfile[domKey]?.[item] ?? 0;

                                                    return (
                                                        <div key={item}>
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-sm font-medium text-slate-700">{item}</span>
                                                                <span
                                                                    className={`text-[10px] font-black uppercase tracking-wide ${currentVal === 3 ? 'text-emerald-600' : currentVal === 2 ? 'text-blue-600' : currentVal === 1 ? 'text-yellow-600' : 'text-slate-300'}`}
                                                                >
                                                                    {CHILD_LEVELS[currentVal].label}
                                                                </span>
                                                            </div>
                                                            {/* Interactive Progress Bar */}
                                                            <div className="flex gap-1 h-3 cursor-pointer group/bar">
                                                                {[0, 1, 2, 3].map((level) => {
                                                                    let barColor = 'bg-slate-100';
                                                                    if (level > 0 && currentVal >= level) {
                                                                        if (level === 1) barColor = 'bg-yellow-400';
                                                                        if (level === 2) barColor = 'bg-blue-400';
                                                                        if (level === 3) barColor = 'bg-emerald-400';
                                                                    }
                                                                    return (
                                                                        <div
                                                                            key={level}
                                                                            onClick={() => updateChildProfile(domKey, item, level)}
                                                                            className={`flex-1 rounded-sm transition-all hover:opacity-80 ${barColor} ${level === 0 ? 'hidden' : ''}`} // Hide 0 bar, show 1-3
                                                                        />
                                                                    );
                                                                })}
                                                                {/* Helper click area for 0 (reset) */}
                                                                <div
                                                                    onClick={() => updateChildProfile(domKey, item, 0)}
                                                                    className="w-4 h-full bg-slate-50 hover:bg-red-100 rounded-sm ml-2 flex items-center justify-center text-[8px] text-slate-300 cursor-pointer"
                                                                    title="Reset"
                                                                >
                                                                    x
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="md:col-span-2">
                                    <label className="label-pro mb-3">Observaciones y Conclusiones</label>
                                    <textarea
                                        value={childObs}
                                        onChange={(e) => setChildObs(e.target.value)}
                                        className="input-pro h-32 resize-none bg-slate-50 border-slate-200"
                                        placeholder="Síntesis cualitativa del perfil de desarrollo..."
                                    />
                                </div>
                            </div>
                        )}
                    </form>
                </div>
                <div className="p-6 border-t bg-white flex justify-end gap-3 sticky bottom-0 z-10">
                    <Button variant="ghost" onClick={onClose} type="button">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            // Manual submit trigger
                            const event = new Event('submit', { cancelable: true, bubbles: true });
                            document.getElementById('evalForm')?.dispatchEvent(event);
                        }}
                        className="px-8"
                    >
                        {isChild ? 'Guardar Perfil' : 'Guardar Evaluación'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
