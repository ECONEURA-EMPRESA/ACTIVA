import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

// Helper for date display formatting
const formatDateForDisplay = (isoDate: string) => {
  if (!isoDate) return new Date().toLocaleDateString('es-ES');
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

interface GroupSessionModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export const GroupSessionModal: React.FC<GroupSessionModalProps> = ({ onClose, onSave }) => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState('');
  const [priceGroup, setPriceGroup] = useState(150);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-3d p-6 animate-in fade-in zoom-in-95">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">Nueva Sesión Grupal</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const d = new FormData(e.target as HTMLFormElement);
            onSave({
              id: `group-${Date.now()}`,
              date: formatDateForDisplay(date),
              time: d.get('time'),
              phase: 2,
              activities: ['Dinámica'],
              location: d.get('location'),
              type: 'group',
              participantNames: participants,
              price: priceGroup,
              paid: false,
              methodology: d.get('methodology'),
              observations: d.get('observations'),
            });
          }}
        >
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="label-pro">Participantes</label>
                <input
                  type="number"
                  value={priceGroup}
                  onChange={(e) => setPriceGroup(Number(e.target.value))}
                  className="w-16 text-right font-bold bg-slate-50 border rounded px-2"
                />
              </div>
              <div className="flex gap-2 mb-3">
                <input
                  className="input-pro"
                  placeholder="Nombre..."
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newParticipant) setParticipants([...participants, newParticipant]);
                    setNewParticipant('');
                  }}
                  icon={PlusCircle}
                >
                  Añadir
                </Button>
              </div>
              <div className="border p-3 rounded-xl h-40 overflow-y-auto bg-slate-50">
                {participants.length === 0 && (
                  <p className="text-slate-400 text-xs italic text-center py-10">
                    Añade participantes a la lista
                  </p>
                )}
                {participants.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between p-2 bg-white border border-slate-100 mb-1 rounded text-sm font-medium shadow-sm"
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-pro">Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-pro"
                    required
                  />
                </div>
                <div>
                  <label className="label-pro">Hora</label>
                  <input
                    type="time"
                    name="time"
                    defaultValue="10:00"
                    className="input-pro"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label-pro">Lugar</label>
                <input name="location" className="input-pro" placeholder="Sala o Centro" required />
              </div>
              <div>
                <label className="label-pro">Metodología</label>
                <textarea
                  name="methodology"
                  className="input-pro h-20 resize-none"
                  placeholder="Técnicas utilizadas..."
                />
              </div>
              <div>
                <label className="label-pro">Observaciones</label>
                <textarea
                  name="observations"
                  className="input-pro h-20 resize-none"
                  placeholder="Dinámica grupal, incidencias..."
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-2 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button type="submit">Guardar Sesión</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
