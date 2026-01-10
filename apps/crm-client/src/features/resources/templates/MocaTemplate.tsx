import { forwardRef } from 'react';

export const MocaTemplate = forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <div ref={ref} className="w-[210mm] min-h-[297mm] bg-white p-[15mm] mx-auto text-slate-900 print:w-full print:h-full print:p-[15mm] print:mx-0 text-xs">
            {/* Header */}
            <header className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight">MoCA</h1>
                    <p className="text-xs font-bold text-slate-500">Evaluación Cognitiva Montreal</p>
                </div>
                <div className="opacity-50 grayscale">
                    <h2 className="text-lg font-bold">MÉTODO ACTIVA</h2>
                </div>
            </header>

            {/* Patient Info */}
            <div className="grid grid-cols-4 gap-4 mb-4 bg-slate-50 p-2 border border-slate-200">
                <div className="col-span-2 border-b border-slate-300">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Nombre:</span>
                </div>
                <div className="border-b border-slate-300">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Fecha:</span>
                </div>
                <div className="border-b border-slate-300">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Nivel Estudios:</span>
                </div>
            </div>

            {/*  TEST GRID */}
            <div className="grid grid-cols-1 border-2 border-slate-900 divide-y-2 divide-slate-900">

                {/* ROW 1: Visuoespacial */}
                <div className="grid grid-cols-12 divide-x-2 divide-slate-900 min-h-[150px]">
                    <div className="col-span-8 p-2">
                        <h4 className="font-bold bg-slate-200 px-1 inline-block mb-2">VISUOESPACIAL / EJECUTIVA</h4>
                        <div className="grid grid-cols-3 gap-4 h-full">
                            {/* Trail Making Mock */}
                            <div className="border border-slate-300 bg-slate-50 rounded p-1 flex items-center justify-center text-center italic text-[10px] text-slate-400">
                                (Alternancia 1-A-2-B...)
                            </div>
                            {/* Cube Mock */}
                            <div className="border border-slate-300 bg-slate-50 rounded p-1 flex items-center justify-center text-center italic text-[10px] text-slate-400">
                                (Copiar Cubo)
                            </div>
                            {/* Clock Mock */}
                            <div className="border border-slate-300 bg-slate-50 rounded p-1 flex items-center justify-center text-center italic text-[10px] text-slate-400">
                                (Dibujar Reloj)
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4 p-2">
                        <h4 className="font-bold bg-slate-200 px-1 inline-block mb-2">PUNTUACIÓN</h4>
                        <div className="flex justify-end mt-12 text-xl font-bold">/5</div>
                    </div>
                </div>

                {/* ROW 2: Identificación */}
                <div className="grid grid-cols-12 divide-x-2 divide-slate-900 min-h-[80px]">
                    <div className="col-span-10 p-2 flex items-center justify-around">
                        <span className="font-bold text-slate-400">[LEÓN]</span>
                        <span className="font-bold text-slate-400">[RINOCERONTE]</span>
                        <span className="font-bold text-slate-400">[CAMELLO]</span>
                    </div>
                    <div className="col-span-2 p-2 relative">
                        <div className="absolute bottom-2 right-2 text-xl font-bold">/3</div>
                    </div>
                </div>

                {/* ROW 3: Memoria */}
                <div className="grid grid-cols-12 divide-x-2 divide-slate-900 min-h-[60px]">
                    <div className="col-span-12 p-2">
                        <h4 className="font-bold bg-slate-200 px-1 inline-block mb-1">MEMORIA</h4>
                        <div className="flex justify-between px-8 text-[10px]">
                            <span>ROSTRO</span>
                            <span>SEDA</span>
                            <span>IGLESIA</span>
                            <span>CLAVEL</span>
                            <span>ROJO</span>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1 italic text-center">Lea la lista de palabras. El paciente debe repetirlas. Haga 2 intentos. Avise del recuerdo diferido.</p>
                    </div>
                </div>

                {/* ROW 4: Atención */}
                <div className="grid grid-cols-12 divide-x-2 divide-slate-900 min-h-[100px]">
                    <div className="col-span-10 p-2 space-y-2">
                        <div className="flex justify-between">
                            <span>Dígitos Directos: 2 1 8 5 4</span>
                            <span className="w-8 h-4 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between">
                            <span>Dígitos Inversos: 7 4 2</span>
                            <span className="w-8 h-4 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-t border-dotted pt-1">
                            <span>Serie Letras ("A"): F B A C M N A A J K L B A F A K D E A A A J A M O F A A B</span>
                            <span className="w-8 h-4 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-t border-dotted pt-1">
                            <span>Resta de 7 en 7 desde 100: [93] [86] [79] [72] [65]</span>
                            <span className="w-8 h-4 border border-slate-400"></span>
                        </div>
                    </div>
                    <div className="col-span-2 p-2 relative">
                        <div className="absolute bottom-2 right-2 text-xl font-bold">/6</div>
                    </div>
                </div>

                {/* ROW 5: Lenguaje */}
                <div className="grid grid-cols-12 divide-x-2 divide-slate-900 min-h-[80px]">
                    <div className="col-span-10 p-2 space-y-2">
                        <p>Repetición: "El gato se esconde bajo el sofá cuando los perros entran en la sala."</p>
                        <p>Repetición: "Espero que él le entregue el mensaje una vez que ella se lo pida."</p>
                        <p className="border-t border-dotted pt-1">Fluidez Verbal: Palabras con "P" (o "F") en 1 min. ({'>'}11 palabras)</p>
                    </div>
                    <div className="col-span-2 p-2 relative">
                        <div className="absolute bottom-2 right-2 text-xl font-bold">/3</div>
                    </div>
                </div>

                {/* ROW 6: Abstracción */}
                <div className="grid grid-cols-12 divide-x-2 divide-slate-900 min-h-[40px]">
                    <div className="col-span-10 p-2 flex justify-around">
                        <span>Similitud: TREN - BICICLETA</span>
                        <span>RELOJ - REGLA</span>
                    </div>
                    <div className="col-span-2 p-2 relative">
                        <div className="absolute bottom-2 right-2 text-xl font-bold">/2</div>
                    </div>
                </div>

                {/* ROW 7: Recuerdo Diferido */}
                <div className="grid grid-cols-12 divide-x-2 divide-slate-900 min-h-[60px]">
                    <div className="col-span-10 p-2 grid grid-cols-5 gap-2 text-center">
                        <div className="border-b border-slate-300 pb-4">ROSTRO</div>
                        <div className="border-b border-slate-300 pb-4">SEDA</div>
                        <div className="border-b border-slate-300 pb-4">IGLESIA</div>
                        <div className="border-b border-slate-300 pb-4">CLAVEL</div>
                        <div className="border-b border-slate-300 pb-4">ROJO</div>
                    </div>
                    <div className="col-span-2 p-2 relative">
                        <div className="absolute bottom-2 right-2 text-xl font-bold">/5</div>
                    </div>
                </div>

                {/* ROW 8: Orientación */}
                <div className="grid grid-cols-12 divide-x-2 divide-slate-900 min-h-[40px]">
                    <div className="col-span-10 p-2 flex justify-between text-[10px]">
                        <span>[FECHA]</span>
                        <span>[MES]</span>
                        <span>[AÑO]</span>
                        <span>[DÍA]</span>
                        <span>[LUGAR]</span>
                        <span>[LOCALIDAD]</span>
                    </div>
                    <div className="col-span-2 p-2 relative">
                        <div className="absolute bottom-2 right-2 text-xl font-bold">/6</div>
                    </div>
                </div>

            </div>

            {/* Footer Total */}
            <div className="mt-4 flex justify-end items-center gap-4">
                <span className="text-xl font-black uppercase">TOTAL:</span>
                <div className="w-24 h-12 border-2 border-slate-900 bg-slate-100 flex items-center justify-center text-2xl font-black">
                    /30
                </div>
            </div>
            <div className="text-right text-[9px] mt-1 italic">
                Añadir 1 punto si tiene ≤ 12 años de estudios. Normal ≥ 26.
            </div>

        </div>
    );
});

MocaTemplate.displayName = 'MocaTemplate';
