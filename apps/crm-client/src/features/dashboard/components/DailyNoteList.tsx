import React, { useState, useEffect } from 'react';
import { Save, Trash2, Check, Plus, StickyNote } from 'lucide-react';
import { NoteItem } from '../../../data/repositories/NoteRepository';
import { useNoteController } from '../../../hooks/controllers/useNoteController';

interface DailyNoteListProps {
    dateStr: string;
}

const NoteRow = ({ item, onUpdate, onDelete }: { item: NoteItem, onUpdate: (id: string, data: Partial<NoteItem>) => void, onDelete: (id: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(item.text);

    useEffect(() => {
        setText(item.text);
    }, [item.text]);

    const handleSave = () => {
        if (text !== item.text) {
            onUpdate(item.id, { text });
        }
        setIsEditing(false);
    };

    return (
        <div className="group flex items-center gap-2 py-2 border-b border-slate-100 last:border-0">
            {/* Checkbox */}
            <button
                onClick={() => onUpdate(item.id, { isCompleted: !item.isCompleted })}
                className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all ${item.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-emerald-400'}`}
            >
                {item.isCompleted && <Check size={10} strokeWidth={4} />}
            </button>

            {/* Input */}
            <div className="flex-1 min-w-0">
                <input
                    className={`w-full bg-transparent text-sm outline-none transition-colors ${item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        setIsEditing(true);
                    }}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSave();
                    }}
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {(isEditing || text !== item.text) && (
                    <button onClick={handleSave} className="p-1 text-emerald-500 hover:bg-emerald-50 rounded" title="Guardar">
                        <Save size={14} />
                    </button>
                )}
                <button onClick={() => onDelete(item.id)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded" title="Eliminar">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

export const DailyNoteList: React.FC<DailyNoteListProps> = ({ dateStr }) => {
    const { items, addItem, updateItem, deleteItem, isLoading } = useNoteController(dateStr);
    // Note: getLoading might not exist in hook, checking hook signature. 
    // Hook returns: { items, addItem, updateItem, deleteItem, isLoading, isSaving... }

    const [newItemText, setNewItemText] = useState('');

    const handleAdd = () => {
        if (!newItemText.trim()) return;
        addItem(newItemText);
        setNewItemText('');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="py-8 text-center text-xs text-slate-400">Cargando notas...</div>
                ) : items.length === 0 ? (
                    <div className="py-8 text-center text-slate-300 flex flex-col items-center gap-2">
                        <StickyNote size={20} className="opacity-20" />
                        <span className="text-xs">Sin notas</span>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {items.map(item => (
                            <NoteRow
                                key={item.id}
                                item={item}
                                onUpdate={updateItem}
                                onDelete={deleteItem}
                            />
                        ))}
                    </div>
                )}
            </div>
            {/* Add New Input */}
            <div className="pt-3 mt-auto relative">
                <input
                    className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Nueva nota..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button
                    onClick={handleAdd}
                    disabled={!newItemText.trim()}
                    className="absolute right-1 top-4 p-1.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors shadow-sm"
                >
                    <Plus size={14} />
                </button>
            </div>
        </div>
    );
};
