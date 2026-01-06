import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Patient } from '../../../lib/types';

interface QuickAppointmentModalProps {
  onClose: () => void;
  patients: Patient[];
  onSave: (data: any) => void;
  mode?: 'existing' | 'new';
}

export const QuickAppointmentModal: React.FC<QuickAppointmentModalProps> = ({
  onClose,
  patients,
  onSave,
  mode = 'existing',
}) => {
  // Mode prop added to auto-select tab
  const [currentMode, setCurrentMode] = useState(mode);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-3d p-6 animate-in fade-in zoom-in-95">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="text-pink-600" /> Agendar Cita
        </h2>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              mode: currentMode,
              patientId: selectedPatientId,
              name: newPatientName,
              date,
              time,
            });
          }}
        >
          <div className="flex bg-slate-50 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => setCurrentMode('existing')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${currentMode === 'existing' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
            >
              Existente
            </button>
            <button
              type="button"
              onClick={() => setCurrentMode('new')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${currentMode === 'new' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
            >
              Nuevo
            </button>
          </div>
          {currentMode === 'existing' ? (
            <select
              className="input-pro"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              required
            >
              <option value="">- Seleccionar -</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="input-pro"
              placeholder="Nombre del nuevo paciente"
              value={newPatientName}
              onChange={(e) => setNewPatientName(e.target.value)}
              required
            />
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-pro">Fecha</label>
              <input
                type="date"
                className="input-pro"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label-pro">Hora</label>
              <input
                type="time"
                className="input-pro"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button type="submit">Confirmar Cita</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
