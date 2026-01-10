import React, { useRef, useState } from 'react';
import { X, Users, Save, Calendar, FileText } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface CreateGroupModalProps {
    onClose: () => void;
    onSave: (groupName: string) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onSave }) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [name, setName] = useState('');

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-3d overflow-hidden flex flex-col animate-in zoom-in-95">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between bg-white sticky top-0 z-20 items-center">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                            <Users size={20} />
                        </div>
                        Nuevo Grupo Terapéutico
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <form
                        ref={formRef}
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (name.trim()) onSave(name.trim());
                        }}
                        className="space-y-5"
                    >
                        <div>
                            <label className="label-pro mb-1.5 block">Nombre del Grupo</label>
                            <input
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-pro text-lg font-semibold"
                                placeholder="Ej. Taller de Memoria - Lunes"
                                required
                            />
                            <p className="text-xs text-slate-500 mt-1.5">
                                Este nombre identificará al grupo en todos los registros y sesiones.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label-pro mb-1.5 block text-slate-400">Horario Habitual (Opcional)</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-slate-300" size={16} />
                                    <input
                                        className="input-pro pl-9"
                                        placeholder="Ej. Lunes 10:00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label-pro mb-1.5 block text-slate-400">Sala / Ubicación (Opcional)</label>
                                <input
                                    className="input-pro"
                                    placeholder="Ej. Sala 2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label-pro mb-1.5 block text-slate-400">Descripción / Notas</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-slate-300" size={16} />
                                <textarea
                                    className="input-pro pl-9 min-h-[80px] resize-none"
                                    placeholder="Objetivos generales, perfil de participantes..."
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <Button onClick={onClose} variant="secondary">
                        Cancelar
                    </Button>
                    <Button
                        icon={Save}
                        onClick={() => formRef.current?.requestSubmit()}
                        disabled={!name.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
                    >
                        Crear Grupo
                    </Button>
                </div>
            </div>
        </div>
    );
};
