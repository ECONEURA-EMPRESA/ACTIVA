import React, { useState } from 'react';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import { Button } from './Button';

// Intentionally keeping layout simple as per snippets.
// Assuming "clinicSettings" and data type based on context.

interface InvoiceGeneratorProps {
  data: any;
  onClose: () => void;
  clinicSettings: any;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  data,
  onClose,
  clinicSettings,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState(
    data.invoiceNumber || `FACT-${Date.now().toString().slice(-6)}`,
  );
  const date = new Date().toLocaleDateString('es-ES');
  const total = data.sessions.reduce((sum: number, s: any) => sum + (s.price || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 animate-in fade-in duration-200">
      {/* Toolbar (Oculto al imprimir) */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md no-print">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="hover:bg-slate-800 p-2 rounded-lg transition-colors">
            <ArrowLeft />
          </button>
          <h2 className="font-bold text-lg">Vista Previa de Factura</h2>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 uppercase font-bold">Nº Factura:</span>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="bg-transparent border-none text-white font-mono font-bold focus:outline-none w-32"
            />
            <Edit size={12} className="text-slate-500" />
          </div>
          <Button
            onClick={handlePrint}
            variant="primary"
            icon={Printer}
            className="shadow-none ring-2 ring-offset-2 ring-offset-slate-900 ring-pink-500"
          >
            IMPRIMIR / PDF
          </Button>
        </div>
      </div>

      {/* Invoice Paper (Lo que se imprime) */}
      <div className="flex-1 overflow-y-auto p-8 flex justify-center invoice-preview-container">
        <div className="invoice-paper bg-white w-full max-w-[210mm] min-h-[297mm] p-[20mm] shadow-2xl relative text-slate-800 print-only">
          {/* Cabecera */}
          <div className="flex justify-between items-start mb-16 border-b-2 border-pink-500 pb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                {clinicSettings.name || 'NOMBRE CLÍNICA'}
              </h1>
              <div className="text-sm text-slate-500 space-y-1">
                <p>{clinicSettings.address || 'Dirección de la clínica'}</p>
                <p>CIF: {clinicSettings.cif || 'B-12345678'}</p>
                <p>
                  {clinicSettings.phone || ''} • {clinicSettings.email || ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-pink-600 uppercase tracking-widest mb-1">
                FACTURA
              </h2>
              <p className="font-mono text-lg text-slate-900">#{invoiceNumber}</p>
              <p className="text-sm text-slate-500 mt-1">Fecha: {date}</p>
            </div>
          </div>

          {/* Cliente */}
          <div className="mb-12 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Facturar a
            </h3>
            <p className="text-xl font-bold text-slate-900">{data.clientName}</p>
            {data.clientMeta && <p className="text-sm text-slate-600 mt-1">{data.clientMeta}</p>}
          </div>

          {/* Tabla Items */}
          <table className="w-full mb-12">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase">
                  Concepto
                </th>
                <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase">Fecha</th>
                <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase">
                  Importe
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.sessions.map((s: any, i: number) => (
                <tr key={i}>
                  <td className="py-4 font-medium text-slate-700">
                    {s.type === 'group'
                      ? `Sesión Grupal: ${s.location || 'Sala Polivalente'}`
                      : 'Sesión de Musicoterapia'}
                    {s.notes && (
                      <div className="text-xs text-slate-400 mt-0.5 font-normal truncate max-w-md">
                        {s.notes}
                      </div>
                    )}
                  </td>
                  <td className="py-4 font-mono text-sm text-slate-500">{s.date}</td>
                  <td className="py-4 text-right font-bold text-slate-900">{s.price} €</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={2}
                  className="pt-6 text-right text-sm font-bold text-slate-500 uppercase"
                >
                  Total a Pagar
                </td>
                <td className="pt-6 text-right text-2xl font-black text-pink-600">
                  {total.toFixed(2)} €
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer Legal */}
          <div className="absolute bottom-[20mm] left-[20mm] right-[20mm] border-t border-slate-200 pt-6 text-center">
            <p className="text-[10px] text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {clinicSettings.legalText ||
                'Documento informativo. El pago debe realizarse según las condiciones acordadas. De acuerdo con la Ley de Protección de Datos, sus datos son tratados con confidencialidad.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
