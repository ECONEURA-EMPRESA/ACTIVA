
import React, { useState, useEffect } from 'react';
import { X, FileText, Printer, Wand2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Patient } from '../../../lib/types';
import logoCircular from '../../../assets/logo-circular.png';
import { useActivityLog } from '../../../hooks/useActivityLog';
import { PATHOLOGY_MAP } from '../../../lib/patientUtils';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  clinicSettings: any;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  patient,
  clinicSettings,
}) => {
  const [reportText, setReportText] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const { logActivity } = useActivityLog();

  // Smart Template Logic (Refactored: Robust & Instant)
  useEffect(() => {
    if (isOpen) {
      // Logic is synchronous and instant (Titanium Standard)
      const today = new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const sessionsCount = patient.sessions?.filter((s) => !s.isAbsent).length || 0;
      const lastEval = patient.cognitiveScores || {};
      const mocaScore = lastEval.moca || 'Pendiente';
      const gdsScore = lastEval.gds || 'No registrado';

      const synthesisText = typeof patient.clinicalFormulation?.synthesis === 'string'
        ? patient.clinicalFormulation.synthesis
        : patient.clinicalFormulation?.synthesis?.text;

      const draft = `INFORME CLÍNICO DE MUSICOTERAPIA
Fecha de emisión: ${today}

1. DATOS DE FILIACIÓN
Paciente: ${patient.name}
Edad: ${patient.age} años
Diagnóstico: ${patient.diagnosis}
Referencia HC: ${patient.reference || 'N/A'}

2. RESUMEN DE INTERVENCIÓN
El paciente inició el tratamiento el ${patient.joinedDate}. A fecha de hoy, ha completado un total de ${sessionsCount} sesiones de musicoterapia.
Actualmente se encuentra en una fase de mantenimiento y estimulación cognitiva activa.

3. EVALUACIÓN Y EVOLUCIÓN
En la última valoración psicométrica realizada, se obtuvieron los siguientes resultados:
- MOCA (Montreal Cognitive Assessment): ${mocaScore}
- Escala GDS (Reisberg): Estadio ${gdsScore}

EVOLUCIÓN RECIENTE (Últimas 5 Sesiones):
${patient.sessions
          ?.slice(0, 5)
          .map(s => {
            const status = s.isAbsent ? '[AUSENCIA]' : '';
            return `- ${s.date} ${status}: ${s.notes || (s.computedPhase ? 'Fase ' + s.computedPhase : 'Sesión Estándar')}`;
          })
          .join('\n') || 'Sin sesiones recientes.'
        }

Observaciones cualitativas:
${synthesisText || 'No se han registrado observaciones específicas en la síntesis diagnóstica.'}

4. OBJETIVOS TRABAJADOS
- Estimulación de la memoria autobiográfica a través de la reminiscencia musical.
- Fomento de la iniciativa y la comunicación verbal.
- Mantenimiento de las capacidades atencionales y funciones ejecutivas.

5. CONCLUSIONES Y RECOMENDACIONES
Se observa una respuesta favorable a la intervención musical...[Espacio para que el terapeuta complete]

Se recomienda la continuidad del tratamiento con una frecuencia de...`;

      setReportText(draft);
      setIsGenerating(false);
    }
  }, [isOpen, patient]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Informe ${patient.name}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; color: #333; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #EC008C; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { height: 60px; }
            .clinic-info { text-align: right; font-size: 12px; color: #666; }
            h1 { font-size: 24px; text-align: center; margin-bottom: 30px; color: #000; text-transform: uppercase; letter-spacing: 2px; }
            pre { font-family: 'Times New Roman', serif; white-space: pre-wrap; font-size: 14px; }
            .signature-block { margin-top: 60px; display: flex; justify-content: space-between; }
            .signature-box { text-align: center; }
            .signature-line { width: 200px; border-top: 1px solid #000; margin-bottom: 5px; }
            .footer { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; text-align: center; font-size: 10px; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoCircular}" class="logo" />
            <div class="clinic-info">
              <strong>${clinicSettings.name || 'Clínica Método Activa'}</strong><br/>
              ${clinicSettings.address || ''}<br/>
              ${clinicSettings.email || ''} | ${clinicSettings.phone || ''}
            </div>
          </div>
          
          <pre>${reportText}</pre>

          <div class="signature-block">
            <div class="signature-box">
              <hr class="signature-line" />
              Fdo. El Terapeuta
            </div>
            <div class="signature-box">
              <hr class="signature-line" />
              VºBº Dirección
            </div>
          </div>

          <div class="footer">
            Documento generado automáticamente por Método Activa Clinical OS v5.0
            <br/>
            ${clinicSettings.legalText || ''}
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    // Explicit Log - No Console
    // Titanium Standard: Only business logic logs, no debug noise
    logActivity('report', `Informe clínico generado para: ${patient.name}`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <FileText className="text-pink-600" /> Generador de Informe Clínico
            </h2>
            <p className="text-sm text-slate-500">Asistente de redacción inteligente v5.0</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
          {/* Left Panel: Context & Template */}
          <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 p-6 overflow-y-auto hidden md:block">
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-pink-700 text-sm mb-2 flex items-center gap-2">
                <Wand2 size={16} /> Smart Template Activo
              </h4>
              <p className="text-xs text-pink-600 leading-relaxed">
                El sistema ha detectado {patient.sessions?.length || 0} sesiones y una evaluación
                reciente. Se ha generado un borrador basado en la fase "{PATHOLOGY_MAP[patient.pathologyType] || patient.pathologyType}" del
                paciente.
              </p>
            </div>

            <h4 className="font-bold text-slate-700 text-sm mb-3 uppercase tracking-wider">
              Variables Inyectadas
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500">Paciente</span>
                <span className="font-bold text-slate-800">{patient.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500">Edad</span>
                <span className="font-bold text-slate-800">{patient.age}</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500">MOCA</span>
                <span className="font-bold text-slate-800">
                  {patient.cognitiveScores?.moca || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Editor */}
          <div className="flex-1 flex flex-col relative">
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center flex-col gap-3">
                <Wand2 className="animate-spin text-pink-500" size={32} />
                <span className="text-sm font-bold text-slate-500">
                  Redactando borrador clínico...
                </span>
              </div>
            )}
            <textarea
              className="flex-1 p-8 resize-none focus:outline-none font-serif text-slate-800 leading-relaxed"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handlePrint} icon={Printer}>
            Imprimir / Guardar PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
