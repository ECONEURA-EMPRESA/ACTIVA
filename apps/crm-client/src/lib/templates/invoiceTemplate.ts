import { InvoiceData } from '../types';

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
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
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
