import React from 'react';
import { X, Trash2, Undo2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Session } from '@/lib/types';

interface RecycleBinModalProps {
    isOpen: boolean;
    onClose: () => void;
    deletedSessions: Session[];
    onRestore: (session: Session) => void;
}

export const RecycleBinModal: React.FC<RecycleBinModalProps> = ({
    isOpen,
    onClose,
    deletedSessions,
    onRestore
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" noPadding>
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                        <Trash2 className="text-slate-500" /> Papelera de Reciclaje
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                    {deletedSessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-4">
                            <Trash2 size={48} className="opacity-20" />
                            <p className="font-medium text-sm">La papelera está vacía</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex gap-3 text-sm text-blue-800 mb-4 items-start">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <p>Los elementos aquí pueden ser restaurados. Si eliminas un paciente, todo se borrará permanentemente.</p>
                            </div>
                            {deletedSessions.map(s => (
                                <div key={s.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center group hover:border-indigo-200 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 p-2.5 rounded-lg text-slate-400 font-bold text-xs text-center min-w-[50px]">
                                            <span className="block text-lg">{new Date(s.date).getDate() || '?'}</span>
                                            <span className="uppercase">{new Date(s.date).toLocaleString('es', { month: 'short' }) || ''}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700">Sesión Clínica</p>
                                            <p className="text-xs text-slate-400">Eliminado: {s.deletedAt ? new Date(s.deletedAt).toLocaleDateString() : 'Desconocido'}</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        icon={Undo2}
                                        onClick={() => onRestore(s)}
                                        className="text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100"
                                    >
                                        Restaurar
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-white flex justify-end">
                    <Button onClick={onClose} variant="ghost">Cerrar</Button>
                </div>
            </Card>
        </div>
    );
};
