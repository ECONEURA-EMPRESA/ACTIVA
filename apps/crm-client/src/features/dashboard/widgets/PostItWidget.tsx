import React from 'react';
import { StickyNote, Save, Trash2 } from 'lucide-react';
import { useNoteController } from '../../../hooks/controllers/useNoteController';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DailyNoteList } from '../components/DailyNoteList';

interface PostItWidgetProps {
    date: Date;
}

export const PostItWidget: React.FC<PostItWidgetProps> = ({ date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const {
        items,
        deleteDailyNote,
        isSaving
    } = useNoteController(dateStr);

    return (
        <div className="group h-full">
            {/* Professional 'Memo' Card */}
            <div className={`
                bg-white
                border border-slate-200
                shadow-sm hover:shadow-md transition-all duration-300
                rounded-xl flex flex-col h-[300px] overflow-hidden
            `}>
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2 text-slate-700">
                        <div className="p-1.5 bg-white rounded-md border border-slate-200 shadow-sm text-slate-500">
                            <StickyNote size={14} />
                        </div>
                        <span className="text-sm font-bold tracking-tight">Notas Clínicas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isSaving && (
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 animate-pulse">
                                <Save size={10} /> Guardando...
                            </span>
                        )}
                        {/* Clear All / Delete Day */}
                        {items.length > 0 && (
                            <button
                                onClick={() => {
                                    if (confirm('¿Borrar TODAS las notas de este día?')) {
                                        deleteDailyNote();
                                    }
                                }}
                                className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded transition-colors"
                                title="Borrar todo"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}

                        <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
                        <span className="text-[10px] font-mono font-medium text-slate-400 uppercase">
                            {format(date, 'MMM dd', { locale: es })}
                        </span>
                    </div>
                </div>

                {/* List Content */}
                <div className="flex-1 p-2 overflow-hidden">
                    <DailyNoteList dateStr={dateStr} />
                </div>
            </div>
        </div>
    );
};
