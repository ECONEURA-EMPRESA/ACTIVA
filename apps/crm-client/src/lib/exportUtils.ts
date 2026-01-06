import { Patient, FormulationData } from './types';

/**
 * UTILITY: Data Sovereignty Engine
 * Handles CSV generation with strict UTF-8 Byte Order Mark (BOM)
 * to ensure Microsoft Excel compatibility without data corruption.
 */

type CSVValue = string | number | boolean | null | undefined;

// Helper: Escape CSV fields to handle commas, quotes, and newlines
const escapeCSV = (value: CSVValue): string => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

// --- EXPORT 1: MASTER PATIENT INDEX ---
export const downloadPatientsCSV = (patients: Patient[]) => {
  const headers = [
    'Reference ID',
    'Nombre Completo',
    'Edad',
    'Diagnóstico',
    'Tipo Patología',
    'Fecha Ingreso',
    'Cuidador',
    'Teléfono',
    'Situación',
    'MOCA (Último)',
    'MMSE (Último)',
    'GDS',
    'Formulación',
  ];

  const rows: CSVValue[][] = patients.map((p) => {
    let formulationText = '-';

    if (p.clinicalFormulation?.synthesis) {
      if (typeof p.clinicalFormulation.synthesis === 'string') {
        formulationText = p.clinicalFormulation.synthesis;
      } else {
        // Type guard for FormulationData
        const synthesis = p.clinicalFormulation.synthesis as FormulationData;
        formulationText = synthesis.text || '-';
      }
    }

    return [
      p.reference || p.id,
      p.name,
      p.age,
      p.diagnosis,
      p.pathologyType,
      p.joinedDate,
      p.caregiverName,
      p.caregiverPhone,
      p.livingSituation,
      p.cognitiveScores?.moca || '-',
      p.cognitiveScores?.mmse || '-',
      p.cognitiveScores?.gds || '-',
      formulationText,
    ];
  });

  generateCSV('Pacientes_Maestro_' + new Date().toISOString().slice(0, 10), headers, rows);
};

// --- EXPORT 2: TRANSACTIONAL SESSION LOG ---
export const downloadSessionsCSV = (patients: Patient[]) => {
  const headers = [
    'Session ID',
    'Paciente Ref',
    'Nombre Paciente',
    'Fecha',
    'Tipo',
    'Fase',
    'Precio',
    'Pagado',
    'Ausencia',
    'Notas',
    'Actividades',
  ];

  const rows: CSVValue[][] = [];

  patients.forEach((p) => {
    (p.sessions || []).forEach((s) => {
      rows.push([
        s.id,
        p.reference || p.id,
        p.name,
        s.date,
        s.type,
        `Fase ${s.phase || 1}`,
        s.price,
        s.paid ? 'SI' : 'NO',
        s.isAbsent ? 'SI' : 'NO',
        s.notes,
        Object.keys(s.activityDetails || {}).join(', '),
      ]);
    });
  });

  generateCSV('Sesiones_Transaccional_' + new Date().toISOString().slice(0, 10), headers, rows);
};

// --- CORE: BLOB GENERATOR ---
const generateCSV = (filename: string, headers: string[], rows: CSVValue[][]) => {
  const csvContent = [headers.join(','), ...rows.map((row) => row.map(escapeCSV).join(','))].join(
    '\n',
  );

  // CRITICAL: Add BOM (\uFEFF) for Excel UTF-8 recognition
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
