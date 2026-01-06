import React from 'react';
import { UploadCloud, FileText, Trash2, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const DocumentsTab: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/50">
                <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadCloud size={32} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Arrastra archivos aquí</h3>
                <p className="text-slate-500 mb-6">Informes externos, DNI, analíticas...</p>
                <Button variant="secondary">Seleccionar Archivo</Button>
            </div>

            <h4 className="font-bold text-slate-700 uppercase text-xs tracking-wider">Archivos Recientes</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-pink-200 transition-all">
                        <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-800 truncate">Informe_Neurologia_2024.pdf</p>
                            <p className="text-xs text-slate-400">24 Oct 2024 • 1.2 MB</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-slate-100 rounded text-slate-500"><Eye size={16} /></button>
                            <button className="p-2 hover:bg-red-50 rounded text-red-500"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
