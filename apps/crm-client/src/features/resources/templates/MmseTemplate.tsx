import { forwardRef } from 'react';

export const MmseTemplate = forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <div ref={ref} className="w-[210mm] min-h-[297mm] bg-white p-[20mm] mx-auto text-slate-900 print:w-full print:h-full print:p-[20mm] print:mx-0">
            {/* Header */}
            <header className="flex justify-between items-center border-b-2 border-slate-900 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">MMSE</h1>
                    <p className="text-sm font-bold text-slate-500">Mini-Mental State Examination</p>
                </div>
                <div className="opacity-50 grayscale">
                    {/* Add Logo if available, or just Text */}
                    <h2 className="text-xl font-bold">ACTIVA MUSICOTERAPIA</h2>
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
                <div className="border-b border-slate-300 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Edad / F.Nac</span>
                    <div className="h-6"></div>
                </div>
                <div className="border-b border-slate-300 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Nivel de Estudios</span>
                    <div className="h-6"></div>
                </div>
            </div>

            {/* Test Content */}
            <div className="space-y-6">

                {/* 1. Orientación */}
                <section>
                    <h3 className="font-bold text-lg bg-slate-100 p-2 border-l-4 border-slate-900 mb-4 flex justify-between">
                        1. ORIENTACIÓN TEMPORAL Y ESPACIAL <span>(Max. 10)</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>¿En qué año estamos?</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>¿En qué estación?</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>¿En qué día (número)?</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>¿En qué mes?</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>¿En qué día de la semana?</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1 mt-4">
                            <span>¿En qué lugar estamos? (Hospital/Centro/Casa)</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>¿En qué piso/planta?</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>¿En qué pueblo/ciudad?</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>¿En qué provincia?</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>¿En qué país?</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                    </div>
                </section>

                {/* 2. Fijación */}
                <section>
                    <h3 className="font-bold text-lg bg-slate-100 p-2 border-l-4 border-slate-900 mb-4 flex justify-between">
                        2. FIJACIÓN (MEMORIA INMEDIATA) <span>(Max. 3)</span>
                    </h3>
                    <p className="text-sm mb-2 italic">Nombrar 3 objetos (ej: PESETA, CABALLO, MANZANA) a 1 seg/palabra. Pedir repetición.</p>
                    <div className="flex justify-end">
                        <span className="w-12 h-8 border border-slate-800 flex items-center justify-center font-bold text-xl">/3</span>
                    </div>
                </section>

                {/* 3. Atención y Cálculo */}
                <section>
                    <h3 className="font-bold text-lg bg-slate-100 p-2 border-l-4 border-slate-900 mb-4 flex justify-between">
                        3. ATENCIÓN Y CÁLCULO <span>(Max. 5)</span>
                    </h3>
                    <p className="text-sm mb-2 italic">Si tiene &lt; 3 años escolaridad: Invertir palabra MUNDO (O-D-N-U-M).</p>
                    <p className="text-sm mb-2 italic">Si tiene &gt; 3 años escolaridad: Restar 7 a partir de 100 series (93, 86, 79, 72, 65).</p>
                    <div className="flex justify-end">
                        <span className="w-12 h-8 border border-slate-800 flex items-center justify-center font-bold text-xl">/5</span>
                    </div>
                </section>

                {/* 4. Recuerdo Diferido */}
                <section>
                    <h3 className="font-bold text-lg bg-slate-100 p-2 border-l-4 border-slate-900 mb-4 flex justify-between">
                        4. RECUERDO DIFERIDO <span>(Max. 3)</span>
                    </h3>
                    <p className="text-sm mb-2 italic">Repetir los 3 objetos anteriores (PESETA, CABALLO, MANZANA).</p>
                    <div className="flex justify-end">
                        <span className="w-12 h-8 border border-slate-800 flex items-center justify-center font-bold text-xl">/3</span>
                    </div>
                </section>

                {/* 5. Lenguaje */}
                <section>
                    <h3 className="font-bold text-lg bg-slate-100 p-2 border-l-4 border-slate-900 mb-4 flex justify-between">
                        5. LENGUAJE Y CONSTRUCCIÓN <span>(Max. 9)</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>Denominación (Mostrar Reloj y Lápiz)</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>Repetición: "Ni sí, ni no, ni pero"</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>Orden 3 Etapas: "Coja papel mano dcha, doble mitad, ponga suelo"</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>Lectura y Ejecución: "CIERRE LOS OJOS"</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                            <span>Escritura: Escribir una frase con sujeto y predicado.</span> <span className="w-12 h-6 border border-slate-400"></span>
                        </div>
                        <div className="flex justify-between items-center border-b border-dotted border-slate-300 pb-1">
                            <span>Copia: Copiar dos pentágonos intersectados.</span>
                            <div className="w-24 h-16 border border-slate-200 ml-4"></div>
                            <span className="w-12 h-6 border border-slate-400 ml-auto"></span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Total */}
            <div className="mt-8 border-t-4 border-slate-900 pt-4 flex justify-end items-center gap-4">
                <span className="text-2xl font-black uppercase">Puntuación Total:</span>
                <div className="w-32 h-16 border-2 border-slate-900 flex items-center justify-center text-3xl font-black bg-slate-50">
                    /30
                </div>
            </div>

            <div className="mt-8 text-center text-[10px] text-slate-400 uppercase">
                27-30: Normal | 24-26: Sospecha Patológica | 12-24: Deterioro | 9-12: Demencia
            </div>
        </div>
    );
});

MmseTemplate.displayName = 'MmseTemplate';
