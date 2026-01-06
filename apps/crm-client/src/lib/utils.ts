import { ClinicSettings, Patient, Session, InvoiceData } from './types';

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

export const calculateDebt = (sessions: any[] = []): number => {
  return sessions.reduce((acc, s) => acc + (s.paid ? 0 : s.price || 0), 0);
};

export const generateInvoiceHTML = (data: InvoiceData): string => {
  const total = data.sessions.reduce((sum, s) => sum + (s.price || 0), 0);
  const date = new Date().toLocaleDateString('es-ES');

  return `
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
                .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                .meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
                table { wudth: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th { text-align: left; border-bottom: 1px solid #ccc; padding: 10px; }
                td { border-bottom: 1px solid #eee; padding: 10px; }
                .total { text-align: right; font-size: 1.5em; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>FACTURA DE SERVICIOS</h1>
                <p>Nº ${data.invoiceNumber || 'BORRADOR'}</p>
            </div>
            <div class="meta">
                <div>
                    <strong>Cliente:</strong><br>
                    ${data.clientName}<br>
                    ${data.clientMeta || ''}
                </div>
                <div style="text-align: right;">
                    <strong>Fecha:</strong> ${date}
                </div>
            </div>
            <table width="100%">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Concepto</th>
                        <th style="text-align: right;">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.sessions
      .map(
        (s) => `
                        <tr>
                            <td>${s.date}</td>
                            <td>Sesión de Musicoterapia (${s.type === 'individual' ? 'Individual' : 'Grupal'})</td>
                            <td style="text-align: right;">${s.price || 0}€</td>
                        </tr>
                    `,
      )
      .join('')}
                </tbody>
            </table>
            <div class="total">
                TOTAL: ${total}€
            </div>
        </body>
        </html>
    `;
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
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

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
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality JPEG
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
