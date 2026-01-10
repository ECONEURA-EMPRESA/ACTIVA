import React, { useState } from 'react';
import {
    Music,
    HeartPulse,
    ShieldAlert,
    Disc,
    X,
    CheckCircle2,
    Mic2
} from 'lucide-react';
import { MusicalIdentity } from '../../../lib/types';
import { Button } from '../../../components/ui/Button';

interface MusicalIdentityModalProps {
    onClose: () => void;
    onSave: (data: MusicalIdentity) => void;
    initialData?: MusicalIdentity;
}

export const MusicalIdentityModal: React.FC<MusicalIdentityModalProps> = ({
    onClose,
    onSave,
    initialData,
}) => {
    const [iso, setIso] = useState<MusicalIdentity>(
        initialData || {
            likes: [],
            dislikes: [],
            biographicalSongs: [],
            instrumentsOfInterest: [],
            musicalTraining: false,
            sensitivityLevel: 'medium',
        },
    );

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 max-h-[90vh]">
                {/* HEADER */}
                <div className="bg-indigo-600 p-6 flex justify-between items-center shrink-0 rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-black flex items-center gap-2 text-white">
                            <Music className="text-indigo-200" size={24} />
                            Identidad Sonora (ISO)
                        </h2>
                        <p className="text-indigo-200 text-sm mt-0.5 font-medium">
                            Historia Musical y Preferencias
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-indigo-700 rounded-full transition-colors text-indigo-100"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* 1. NOCIVO (RED) */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                                <ShieldAlert size={18} /> ISO Nocivo (Aversivo)
                            </h4>
                            <TagInput
                                placeholder="Sonidos prohibidos (ej: Sirenas)..."
                                tags={iso.dislikes}
                                onAdd={(t: string) => setIso((p) => ({ ...p, dislikes: [...p.dislikes, t] }))}
                                onRemove={(t: string) => setIso((p) => ({ ...p, dislikes: p.dislikes.filter((x) => x !== t) }))}
                                color="red"
                            />
                            <p className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded">
                                ⚠️ Estos sonidos pueden desencadenar crisis o malestar severo.
                            </p>
                        </div>

                        {/* 2. BIOGRÁFICO (INDIGO) */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-indigo-700 mb-4 flex items-center gap-2">
                                <HeartPulse size={18} /> Canciones Biográficas
                            </h4>
                            <TagInput
                                placeholder="Canción clave (ej: Bésame Mucho)..."
                                tags={iso.biographicalSongs}
                                onAdd={(t: string) => setIso((p) => ({ ...p, biographicalSongs: [...p.biographicalSongs, t] }))}
                                onRemove={(t: string) => setIso((p) => ({ ...p, biographicalSongs: p.biographicalSongs.filter((x) => x !== t) }))}
                                color="indigo"
                            />
                            <p className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded">
                                💡 Música con alta valencia emocional positiva (reminiscencia).
                            </p>
                        </div>
                    </div>

                    {/* 3. GENERAL (SLATE) */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <Disc size={18} /> Gustos Generales & Instrumentos
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Géneros y Artistas</label>
                                <TagInput
                                    placeholder="Ej: Boleros, Beatles..."
                                    tags={iso.likes}
                                    onAdd={(t: string) => setIso((p) => ({ ...p, likes: [...p.likes, t] }))}
                                    onRemove={(t: string) => setIso((p) => ({ ...p, likes: p.likes.filter((x) => x !== t) }))}
                                    color="slate"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Instrumentos de Interés</label>
                                <TagInput
                                    placeholder="Ej: Piano, Maracas..."
                                    tags={iso.instrumentsOfInterest || []}
                                    onAdd={(t: string) => setIso((p) => ({ ...p, instrumentsOfInterest: [...(p.instrumentsOfInterest || []), t] }))}
                                    onRemove={(t: string) => setIso((p) => ({ ...p, instrumentsOfInterest: (p.instrumentsOfInterest || []).filter((x) => x !== t) }))}
                                    color="emerald"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                        <Mic2 className="text-slate-400" size={24} />
                        <div className="flex-1">
                            <h5 className="font-bold text-slate-700">Formación Musical</h5>
                            <p className="text-xs text-slate-400">¿Tiene conocimientos previos?</p>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={iso.musicalTraining}
                                onChange={(e) => setIso(prev => ({ ...prev, musicalTraining: e.target.checked }))}
                                className="w-5 h-5 accent-indigo-600 rounded"
                            />
                            <span className="text-sm font-bold text-slate-600">Sí, tiene formación</span>
                        </label>
                    </div>

                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0 rounded-b-2xl">
                    <Button variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => onSave(iso)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100"
                        icon={CheckCircle2}
                    >
                        Guardar Cambio ISO
                    </Button>
                </div>
            </div>
        </div>
    );
};

const TagInput = ({ placeholder, tags, onAdd, onRemove, color }: any) => {
    const [val, setVal] = useState('');

    // Add pending tag on Enter or Blur
    const commitTag = () => {
        if (val.trim()) {
            onAdd(val.trim());
            setVal('');
        }
    };

    const handleKey = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitTag();
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((t: string, i: number) => (
                    <span
                        key={i}
                        className={`px-2 py-1 rounded bg-${color}-50 text-${color}-700 border border-${color}-100 text-xs font-bold flex items-center gap-1 shadow-sm`}
                    >
                        {t}{' '}
                        <button type="button" onClick={() => onRemove(t)} className="hover:text-red-600 transition-colors">
                            <X size={12} />
                        </button>
                    </span>
                ))}
            </div>
            <input
                className="w-full text-sm border-0 border-b-2 border-slate-100 focus:border-indigo-500 focus:ring-0 px-0 py-2 bg-transparent placeholder-slate-400 transition-colors"
                placeholder={placeholder + ' (Enter)'}
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={handleKey}
                onBlur={commitTag} // CRITICAL FIX: Save on blur
            />
        </div>
    );
};
