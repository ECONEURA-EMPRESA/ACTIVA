import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ClinicSettings, Patient, Session } from '../../lib/types';
import { formatDateForDisplay } from '../../lib/utils';


interface InvoiceGeneratorProps {
  data: {
    client: Patient;
    sessions: Session[];
    month: string;
    total: number;
    invoiceNo: string;
    date: string;
  };
  settings: ClinicSettings;
  onClose: () => void;
}

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ data, settings, onClose }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef: componentRef });
  const [isQuote, setIsQuote] = React.useState(false);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:block print:relative">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl print:shadow-none print:max-w-none print:h-auto print:rounded-none">
        {/* Header (No print) */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 no-print">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Printer size={24} className={isQuote ? 'text-amber-500' : 'text-pink-600'} />
              {isQuote ? 'Vista Previa Presupuesto' : 'Vista Previa Factura'}
            </h2>
            <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-lg">
              <button
                onClick={() => setIsQuote(false)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${!isQuote ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}
              >Factura</button>
              <button
                onClick={() => setIsQuote(true)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${isQuote ? 'bg-white shadow text-amber-700' : 'text-slate-500'}`}
              >Presupuesto</button>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            <Button onClick={() => handlePrint()} icon={Download}>
              {isQuote ? 'Descargar Presupuesto' : 'Descargar Factura'}
            </Button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="overflow-y-auto p-8 bg-slate-100 print:p-0 print:bg-white print:overflow-visible invoice-preview-container">
          <div
            ref={componentRef}
            className="bg-white p-12 max-w-3xl mx-auto shadow-lg min-h-[1000px] print:shadow-none print:min-h-0 print:m-0 print:w-full invoice-paper"
          >
            {/* Header Factura */}
            <div className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">
                  {settings.name || 'NOMBRE CLÍNICA'}
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  {settings.legalText || 'Servicios de Musicoterapia Clínica'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {isQuote ? 'Presupuesto N°' : 'Factura N°'}
                </p>
                <p className={`text-2xl font-mono font-bold ${isQuote ? 'text-amber-600' : 'text-pink-600'}`}>
                  {isQuote ? `PRE-${data.invoiceNo}` : data.invoiceNo}
                </p>
                <p className="text-sm text-slate-500 mt-1">{formatDateForDisplay(data.date)}</p>
              </div>
            </div>

            {/* Info Cliente/Emisor */}
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                  De
                </p>
                <h4 className="font-bold text-slate-900 text-lg mb-1">
                  {settings.name || 'Empresa'}
                </h4>
                <div className="text-sm text-slate-500 space-y-1">
                  <p>{settings.cif || 'CIF/NIF: -'}</p>
                  <p>{settings.address || 'Dirección: -'}</p>
                  <p>{settings.email || 'Email: -'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">
                  Para
                </p>
                <h4 className="font-bold text-slate-900 text-lg mb-1">{data.client.name}</h4>
                <div className="text-sm text-slate-500 space-y-1">
                  <p>
                    Ref: <span className="font-mono text-slate-700">{data.client.reference}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Tabla Conceptos */}
            <div className="mb-12">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-widest rounded-l-lg">
                      Concepto / Fecha
                    </th>
                    <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">
                      Precio Unit.
                    </th>
                    <th className="py-4 px-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right rounded-r-lg">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.sessions.map((s, i) => (
                    <tr key={i}>
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-700">
                          Sesión de Musicoterapia {s.type === 'group' ? 'Grupal' : 'Individual'}
                        </p>
                        <p className="text-xs text-slate-400">{s.date}</p>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-slate-600">{s.price}€</td>
                      <td className="py-4 px-4 text-right font-bold font-mono text-slate-900">
                        {s.price}€
                      </td>
                    </tr>
                  ))}
                  {data.sessions.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400 italic">
                        No hay sesiones facturables seleccionadas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="flex justify-end border-t-2 border-slate-900 pt-8">
              <div className="w-64">
                <div className="flex justify-between mb-3 text-slate-500">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-mono">{data.total}€</span>
                </div>
                <div className="flex justify-between mb-4 text-slate-500">
                  <span className="font-medium">IVA (0%)</span>
                  <span className="font-mono">0.00€</span>
                </div>
                <div className="flex justify-between text-slate-900 border-t border-slate-200 pt-4">
                  <span className="font-black text-xl">TOTAL</span>
                  <span className="font-black text-xl font-mono text-pink-600">{data.total}€</span>
                </div>
              </div>
            </div>

            {/* Footer Legal */}
            <div className="mt-20 pt-8 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 mb-2">
                {isQuote ? 'Presupuesto válido por 15 días.' : 'Gracias por su confianza'}
              </p>
              <p className="text-[10px] text-slate-300 uppercase">
                Documento generado automáticamente por Método Activa SaaS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
