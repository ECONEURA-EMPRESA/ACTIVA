import { ClinicSettings, Patient, Session } from './types';
import { generateInvoiceHTML } from './templates/invoiceTemplate';

export const formatDateForInput = (dateStr?: string): string => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const parts = dateStr.split('/');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return dateStr;
};

export const formatDateForDisplay = (isoDate?: string): string => {
  if (!isoDate) return new Date().toLocaleDateString('es-ES');
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

export const parseDate = (str?: string): Date => {
  if (!str) return new Date();
  const parts = str.split('/');
  // Asumiendo formato DD/MM/YYYY
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  return new Date();
};

export const printConsent = (clinicData: ClinicSettings, patientData: Partial<Patient>) => {
  alert(
    `Generando Documento de Consentimiento Informado para:\nPaciente: ${patientData.name}\nRef: ${patientData.reference || 'S/R'}\nEdad: ${patientData.age}\n\nCentro: ${clinicData.name || 'Centro Activa'}`,
  );
};

export const calculateDebt = (sessions: Partial<Session>[] = []): number => {
  return sessions.reduce((acc, s) => acc + (s.paid ? 0 : s.price || 0), 0);
};

export const printInvoice = (
  patient: Patient,
  sessionsToBill: Session[],
  invoiceNumber: string,
) => {
  const html = generateInvoiceHTML({
    clientName: patient.name,
    clientMeta: `DNI/REF: ${patient.reference || '-'}`,
    sessions: sessionsToBill,
    invoiceNumber: invoiceNumber,
  });

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    win.print();
  }
};

export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 1. Validate File Type
    if (!file.type.match(/image.*/)) {
      return reject(new Error("File is not an image"));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');

        // TITANIUM CONFIG:
        // Max Dimension: 1024px (High Quality Profile/Doc) - Up from 300px
        // Format: WebP (Modern, efficient)
        // Quality: 0.8 (Excellent balance)
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;

        let width = img.width;
        let height = img.height;

        // Calculate Access Ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error("Canvas Context missing"));

        // Smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        const webpData = canvas.toDataURL('image/webp', 0.8);

        // Simple check: If browser returned PNG (no WebP support) or string is huge, fallback to JPEG
        if (webpData.startsWith('data:image/webp')) {
          resolve(webpData);
        } else {
          // Fallback for Safari < 14 or ancient browsers
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        }
      };

      img.onerror = (_err) => reject(new Error("Image Load Failed"));
    };

    reader.onerror = (_err) => reject(new Error("File Read Failed"));
  });
};
