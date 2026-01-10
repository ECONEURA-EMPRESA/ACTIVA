import { forwardRef } from 'react';

export const GdsTemplate = forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <div ref={ref} className="w-[210mm] min-h-[297mm] bg-white p-[20mm] mx-auto text-slate-900 print:w-full print:h-full print:p-[20mm] print:mx-0">
            {/* Header */}
            <header className="flex justify-between items-center border-b-2 border-slate-900 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">GDS - YESAVAGE</h1>
                    <p className="text-sm font-bold text-slate-500">Escala de Depresión Geriátrica (15 ítems)</p>
                </div>
                <div className="opacity-50 grayscale">
                    <h2 className="text-xl font-bold">MÉTODO ACTIVA</h2>
                </div>
            </header>

            {/* Patient Info Block */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="border-b border-slate-300 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Nombre del Paciente</span>
                    <div className="h-6"></div>
                </div>
                <div className="border-b border-slate-300 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Fecha</span>
                    <div className="h-6"></div>
                </div>
            </div>

            <p className="text-sm italic mb-6 text-slate-600">
                Instrucciones: Responda SÍ o NO según cómo se haya sentido durante la última semana.
            </p>

            {/* Questions Table */}
            <table className="w-full text-sm border-collapse mb-8">
                <thead>
                    <tr className="bg-slate-100 border-y-2 border-slate-900 text-left">
                        <th className="p-3 w-12">#</th>
                        <th className="p-3">Pregunta</th>
                        <th className="p-3 w-40 text-center">Respuesta</th>
                    </tr>
                </thead>
                <tbody className="text-base font-medium">
                    {[
                        "¿Está usted básicamente satisfecho con su vida?",
                        "¿Ha disminuido o abandonado muchos de sus intereses y actividades?",
                        "¿Siente que su vida está vacía?",
                        "¿Se siente a menudo aburrido?",
                        "¿Está usted de buen ánimo la mayor parte del tiempo?",
                        "¿Tiene miedo de que algo le vaya a pasar?",
                        "¿Se siente feliz la mayor parte del tiempo?",
                        "¿Se siente a menudo desamparado?",
                        "¿Prefiere usted quedarse en casa, más que salir y hacer cosas nuevas?",
                        "¿Siente usted que tiene más problemas con su memoria que la mayoría?",
                        "¿Cree usted que es maravilloso estar vivo?",
                        "¿Se siente usted inútil o despreciable como está usted actualmente?",
                        "¿Se siente usted lleno de energía?",
                        "¿Se encuentra usted sin esperanza ante su situación actual?",
                        "¿Cree usted que las otras personas están en general mejor que usted?"
                    ].map((q, i) => (
                        <tr key={i} className="border-b border-slate-200">
                            <td className="p-3 font-bold text-slate-400">{i + 1}</td>
                            <td className="p-3 text-slate-800">{q}</td>
                            <td className="p-3 flex gap-4 justify-center">
                                <span className="w-8 h-8 border border-slate-300 rounded-full flex items-center justify-center text-xs text-slate-400 uppercase">SÍ</span>
                                <span className="w-8 h-8 border border-slate-300 rounded-full flex items-center justify-center text-xs text-slate-400 uppercase">NO</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Total */}
            <div className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-lg mb-1">INTERPRETACIÓN</h4>
                    <ul className="text-xs text-slate-500 space-y-1">
                        <li><strong>0 - 5:</strong> Normal</li>
                        <li><strong>6 - 9:</strong> Depresión Probable</li>
                        <li><strong>10+:</strong> Depresión Establecida</li>
                    </ul>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold uppercase">Total:</span>
                    <div className="w-24 h-16 border-2 border-slate-900 bg-white flex items-center justify-center text-3xl font-black">
                        /15
                    </div>
                </div>
            </div>
        </div>
    );
});

GdsTemplate.displayName = 'GdsTemplate';
