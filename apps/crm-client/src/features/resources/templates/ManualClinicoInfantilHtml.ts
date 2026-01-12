export const MANUAL_CLINICO_INFANTIL_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manual Clínico Infantil - Método Activa (Completo)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Open+Sans:wght@400;600;700&family=Comic+Neue:wght@700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        /* --- ESTILOS GENERALES Y DE IMPRESIÓN --- */
        body {
            font-family: 'Open Sans', sans-serif;
            background-color: #555;
            margin: 0;
            padding: 40px 0 0 0; /* Espacio para el header fijo */
        }
        
        h1, h2, h3, h4, .brand-font { font-family: 'Montserrat', sans-serif; }
        .kid-font { font-family: 'Comic Neue', cursive; }

        /* COLORES */
        .gradient-body { background: linear-gradient(135deg, #FFD200 0%, #F7941D 100%); }
        .text-body { color: #F7941D; }
        .border-body { border-color: #F7941D; }
        .bg-body-soft { background-color: #FFF3E0; }
        
        .gradient-mind { background: linear-gradient(135deg, #2DD6F5 0%, #00AEEF 100%); }
        .text-mind { color: #00AEEF; }
        .border-mind { border-color: #00AEEF; }
        .bg-mind-soft { background-color: #E1F5FE; }
        
        .gradient-heart { background: linear-gradient(135deg, #FF4081 0%, #C2185B 100%); }
        .text-heart { color: #EC008C; }
        .border-heart { border-color: #EC008C; }
        .bg-heart-soft { background-color: #FCE4EC; }

        .text-dark { color: #1A1A1A; }
        .bg-dark { background-color: #1A1A1A; }

        /* PÁGINA A4 */
        .page-a4 {
            width: 210mm;
            min-height: 297mm;
            margin: 40px auto;
            background: white;
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
            position: relative;
            padding: 20mm;
            overflow: hidden;
            page-break-after: always;
            box-sizing: border-box;
        }

        /* LÍNEAS DE ESCRITURA (MÁS ESPACIO) */
        .input-line {
            border-bottom: 1px solid #ccc;
            min-height: 32px; /* Más altura */
            margin-bottom: 8px; /* Más margen */
            width: 100%;
            display: inline-block;
        }
        
        .checkbox-box {
            width: 16px; height: 16px; border: 1px solid #333;
            display: inline-block; margin-right: 6px; vertical-align: middle;
            border-radius: 3px;
        }

        .watermark {
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px; font-weight: 900; color: rgba(0,0,0,0.02);
            pointer-events: none; z-index: 0; white-space: nowrap;
        }

        .page-number { position: absolute; bottom: 15mm; right: 20mm; font-size: 10px; color: #999; }
        .lined-paper { background-image: linear-gradient(#e5e7eb 1px, transparent 1px); background-size: 100% 2.5rem; line-height: 2.5rem; }

        /* HEADER FIJO (SOLO PANTALLA) */
        .screen-controls {
            position: fixed; top: 0; left: 0; right: 0;
            height: 60px; background: #1f2937; color: white;
            display: flex; justify-content: space-between; items-center;
            padding: 0 20px; z-index: 1000; box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
        .btn-download {
            background-color: #EC008C; color: white; border: none;
            padding: 10px 20px; border-radius: 8px; font-weight: bold;
            cursor: pointer; display: flex; align-items: center; gap: 8px;
            font-family: 'Montserrat', sans-serif;
            transition: background 0.2s;
        }
        .btn-download:hover { background-color: #C2185B; }

        @media print {
            body { background: white; padding: 0; }
            .screen-controls { display: none !important; }
            .page-a4 {
                width: 100%; height: 297mm; margin: 0;
                box-shadow: none; border: none; page-break-after: always;
            }
            .no-print { display: none; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
    </style>
</head>
<body>

    <!-- PÁGINA 1: PORTADA -->
    <div class="page-a4 flex flex-col justify-between items-center text-center p-0" style="padding: 0;">
        <div class="absolute top-0 left-0 w-full h-1/2 bg-dark rounded-b-[50%] z-0"></div>
        <div class="relative z-10 w-full pt-20 text-white">
            <h3 class="tracking-[0.3em] uppercase text-sm mb-4 opacity-80">Aurora del Río</h3>
            <h1 class="text-6xl font-extrabold brand-font mb-2">MÉTODO <span class="text-mind">ACTIVA</span></h1>
            <div class="w-20 h-2 bg-body mx-auto rounded-full my-6"></div>
            <h2 class="text-2xl font-light uppercase tracking-widest">Primera Edición</h2>
        </div>
        <div class="relative z-10 bg-white w-3/4 p-12 rounded-3xl shadow-2xl border-t-8 border-heart -mt-10">
            <h2 class="text-3xl font-bold text-dark mb-2 brand-font uppercase">Registro Clínico</h2>
            <p class="text-gray-500 uppercase tracking-wide text-xs mb-8">Población Infantil</p>
            <div class="text-left mt-8 space-y-6">
                <div><label class="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre Paciente</label><div class="border-b-2 border-gray-200 h-8"></div></div>
                <div><label class="block text-xs font-bold text-gray-400 uppercase mb-1">Referencia</label><div class="border-b-2 border-gray-200 h-8"></div></div>
            </div>
        </div>
        <div class="pb-16 text-gray-400 text-xs"><p class="font-bold text-dark">Edición 2025</p></div>
    </div>

    <!-- PÁGINA 2: JUSTIFICACIÓN -->
    <div class="page-a4">
        <div class="watermark">INFANTIL</div>
        <div class="flex items-center mb-8 border-b-2 border-gray-100 pb-4">
            <div class="w-2 h-12 gradient-body rounded-full mr-4"></div>
            <div>
                <h2 class="text-3xl font-bold text-dark">Justificación</h2>
                <p class="text-body font-bold text-sm">Enfoque Clínico y del Neurodesarrollo</p>
            </div>
        </div>
        <div class="text-justify text-gray-700 space-y-6 text-sm leading-relaxed">
            <p>El <strong>Registro Clínico - Población Infantil</strong> ha sido diseñado como una herramienta profesional orientada a facilitar la intervención clínica con niños. Se basa en principios del neurodesarrollo y la regulación emocional.</p>
            <div class="bg-blue-50 p-6 rounded-xl border-l-4 border-mind">
                <h4 class="text-mind font-bold mb-2 text-sm uppercase"><i class="fas fa-brain mr-2"></i> Enfoque del Neurodesarrollo</h4>
                <p class="text-xs">La música permite trabajar de forma integrada aspectos sensoriales, emocionales y relacionales, facilitando experiencias de <strong>co-regulación</strong>.</p>
            </div>
            <div class="grid grid-cols-2 gap-6 mt-8">
                <div>
                    <h4 class="text-xs font-bold text-gray-400 uppercase mb-2 border-b">Población Objetivo</h4>
                    <ul class="text-xs space-y-2 list-none">
                        <li><span class="text-heart font-bold">•</span> TEA / TDAH</li>
                        <li><span class="text-heart font-bold">•</span> Retraso del desarrollo</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="page-number">Página 2</div>
    </div>

    <!-- PÁGINA 3: ACUERDO -->
    <div class="page-a4">
        <h2 class="text-2xl font-bold text-dark brand-font uppercase mb-2">Acuerdo de Bienestar</h2>
        <div class="h-1 w-16 bg-heart rounded-full mb-8"></div>
        <div class="grid grid-cols-2 gap-8 text-sm text-gray-700 leading-relaxed">
            <div>
                <h4 class="font-bold text-dark mb-2 uppercase text-xs border-b pb-1">1. Objetivos</h4>
                <p class="mb-4 text-xs">Reducir estrés, facilitar expresión y estimular capacidades.</p>
                <h4 class="font-bold text-dark mb-2 uppercase text-xs border-b pb-1">2. Compromiso</h4>
                <ul class="list-disc pl-4 space-y-1 text-xs">
                    <li>Asistencia regular.</li>
                    <li>Aviso previo de ausencia.</li>
                </ul>
            </div>
            <div>
                 <h4 class="font-bold text-dark mb-2 uppercase text-xs border-b pb-1">3. Condiciones</h4>
                 <p class="text-xs">La intervención se ajustará a las necesidades del menor.</p>
            </div>
        </div>
        <div class="border-2 border-dark rounded-xl p-8 mt-8 flex-1">
            <h3 class="text-lg font-bold text-dark uppercase mb-4 text-center">Consentimiento</h3>
             <p class="text-sm text-justify leading-relaxed mb-12">
                Declaro que he recibido información clara y doy mi consentimiento para iniciar este acompañamiento terapéutico.
            </p>
            <div class="grid grid-cols-2 gap-12">
                <div><div class="border-b border-dark h-12 mb-2"></div><p class="text-xs text-center font-bold">Firma Tutor/a Legal</p></div>
                <div><div class="border-b border-dark h-12 mb-2"></div><p class="text-xs text-center font-bold">Firma Musicoterapeuta</p></div>
            </div>
        </div>
        <div class="page-number">Página 3</div>
    </div>

    <!-- PÁGINA 4: HOJA DE ADMISIÓN -->
    <div class="page-a4">
        <div class="flex items-center mb-6">
            <div class="w-10 h-10 rounded-full bg-mind text-white flex items-center justify-center font-bold mr-3">1</div>
            <h2 class="text-2xl font-bold text-dark">Hoja de Admisión</h2>
        </div>
        <div class="border border-gray-300 rounded-lg p-6 mb-6">
            <h3 class="text-xs font-bold text-mind uppercase mb-4">1.1 Datos Generales</h3>
            <div class="grid grid-cols-2 gap-8 mb-4">
                <div><label class="text-xs text-gray-500 font-bold">Nombre del niño/a</label><div class="input-line"></div></div>
                <div><label class="text-xs text-gray-500 font-bold">Fecha Nacimiento</label><div class="input-line"></div></div>
                <div><label class="text-xs text-gray-500 font-bold">Edad Cronológica</label><div class="input-line"></div></div>
                <div><label class="text-xs text-gray-500 font-bold">Profesional</label><div class="input-line"></div></div>
            </div>
        </div>
        <div class="border border-gray-300 rounded-lg p-6">
            <h3 class="text-xs font-bold text-dark uppercase mb-4">1.4 Desarrollo y Contexto</h3>
            <div class="space-y-4">
                <div><label class="text-xs font-bold">Dificultades Principales:</label><div class="input-line"></div><div class="input-line"></div><div class="input-line"></div></div>
            </div>
        </div>
        <div class="page-number">Página 4</div>
    </div>

    <!-- PÁGINA 5: PERFIL SENSORIAL -->
    <div class="page-a4">
        <h2 class="text-2xl font-bold text-dark mb-8">Perfil Sensorial y Musical</h2>
        <div class="grid grid-cols-2 gap-8 mb-8">
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 class="text-sm font-bold text-mind uppercase mb-4">Perfil Sensorial</h3>
                <div class="mb-4">
                    <label class="block text-xs font-bold mb-1">Respuesta Auditiva</label>
                    <div class="text-xs space-y-1">
                        <div><span class="checkbox-box"></span> Busca sonidos</div>
                        <div><span class="checkbox-box"></span> Hipersensibilidad</div>
                    </div>
                </div>
                <div><label class="block text-xs font-bold mb-1">Estrategias de Calma</label><div class="text-xs space-y-1"><div><span class="checkbox-box"></span> Movimiento</div><div><span class="checkbox-box"></span> Objetos</div></div></div>
            </div>
            <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 class="text-sm font-bold text-heart uppercase mb-4">Relación Musical</h3>
                <div class="mb-4"><label class="block text-xs font-bold mb-1">Conductas Musicales</label><div class="text-xs space-y-1"><div><span class="checkbox-box"></span> Ritmo</div><div><span class="checkbox-box"></span> Canto</div></div></div>
            </div>
        </div>
        <div class="border-t-2 border-dark pt-6 mt-8">
            <h3 class="text-sm font-bold uppercase mb-4">Observaciones Adicionales</h3>
            <div class="input-line"></div><div class="input-line"></div><div class="input-line"></div><div class="input-line"></div>
        </div>
        <div class="page-number">Página 5</div>
    </div>

    <!-- PÁGINA 6: FORMULACIÓN -->
    <div class="page-a4">
        <div class="flex items-center mb-6">
            <div class="w-10 h-10 rounded-full bg-body text-white flex items-center justify-center font-bold mr-3">3</div>
            <h2 class="text-2xl font-bold text-dark">Formulación Clínica</h2>
        </div>
        <div class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
                <div>
                    <h3 class="text-sm font-bold text-mind uppercase mb-2">Fortalezas</h3>
                    <div class="border rounded-lg p-4 bg-white min-h-[150px]">
                        <div class="input-line"></div><div class="input-line"></div><div class="input-line"></div><div class="input-line"></div>
                    </div>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-heart uppercase mb-2">Necesidades</h3>
                    <div class="border rounded-lg p-4 bg-white min-h-[150px]">
                        <div class="input-line"></div><div class="input-line"></div><div class="input-line"></div><div class="input-line"></div>
                    </div>
                </div>
            </div>
            <div>
                <h3 class="text-sm font-bold text-dark uppercase mb-2">Hipótesis Terapéutica</h3>
                <div class="border-l-4 border-dark pl-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-r-lg">
                    <div class="input-line"></div><div class="input-line"></div><div class="input-line"></div><div class="input-line"></div>
                </div>
            </div>
        </div>
        <div class="page-number">Página 6</div>
    </div>

    <!-- PÁGINA 7: PLAN DE TRATAMIENTO -->
    <div class="page-a4">
        <div class="watermark" style="font-size: 60px;">PLAN</div>
        <h2 class="text-3xl font-bold text-dark mb-6">Plan de Tratamiento</h2>
        <div class="space-y-4 relative">
            <div class="absolute left-6 top-4 bottom-4 w-1 bg-gray-200 z-0"></div>
            <div class="relative z-10 pl-16 mb-4">
                <div class="absolute left-3 top-0 w-7 h-7 rounded-full bg-body border-4 border-white shadow"></div>
                <h3 class="text-body font-bold uppercase">Fase 1: Seguridad (1-4)</h3>
                <div class="bg-body-soft p-4 rounded-lg text-sm border border-body"><p>Familiarización y Vínculo.</p></div>
            </div>
            <div class="relative z-10 pl-16 mb-4">
                <div class="absolute left-3 top-0 w-7 h-7 rounded-full bg-mind border-4 border-white shadow"></div>
                <h3 class="text-mind font-bold uppercase">Fase 2: Atención (5-8)</h3>
                <div class="bg-mind-soft p-4 rounded-lg text-sm border border-mind"><p>Atención Conjunta y Turnos.</p></div>
            </div>
            <div class="relative z-10 pl-16 mb-4">
                <div class="absolute left-3 top-0 w-7 h-7 rounded-full bg-heart border-4 border-white shadow"></div>
                <h3 class="text-heart font-bold uppercase">Fase 3: Expresión (9-12)</h3>
                <div class="bg-heart-soft p-4 rounded-lg text-sm border border-heart"><p>Comunicación e Iniciativa.</p></div>
            </div>
        </div>
        <div class="page-number">Página 7</div>
    </div>

    <!-- PÁGINA 8: REGISTRO DE SESIÓN -->
    <div class="page-a4">
        <div class="bg-dark text-white p-4 rounded-t-xl flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold uppercase tracking-wider">Registro de Sesión</h2>
        </div>
        <div class="flex gap-4 mb-6 border-b border-gray-200 pb-4">
            <div class="flex-1"><label class="text-xs text-gray-400 uppercase font-bold">Paciente</label><div class="input-line"></div></div>
            <div class="w-24"><label class="text-xs text-gray-400 uppercase font-bold">Fecha</label><div class="input-line"></div></div>
        </div>
        <div class="grid grid-cols-2 gap-8 mb-6">
            <div>
                <h3 class="text-mind font-bold text-xs uppercase mb-2 border-b-2 border-mind pb-1">Objetivos</h3>
                <div class="space-y-2 text-xs">
                    <div><span class="checkbox-box"></span> Regulación</div>
                    <div><span class="checkbox-box"></span> Atención</div>
                    <div><span class="checkbox-box"></span> Comunicación</div>
                </div>
            </div>
            <div>
                <h3 class="text-body font-bold text-xs uppercase mb-2 border-b-2 border-body pb-1">Actividades</h3>
                <div class="mt-4"><div class="input-line"></div><div class="input-line"></div><div class="input-line"></div></div>
            </div>
        </div>
        <div class="mb-6">
            <h3 class="text-xs font-bold text-dark uppercase mb-2">Observaciones Cualitativas</h3>
            <div class="w-full h-40 border border-gray-300 rounded p-2 bg-[linear-gradient(transparent_1.9rem,#f0f0f0_2rem)] bg-[length:100%_2rem] leading-[2rem]"></div>
        </div>
        <div class="page-number">Página 8</div>
    </div>
    
    <!-- PÁGINA 9: NOTAS -->
    <div class="page-a4 lined-paper">
        <h2 class="text-2xl font-bold text-dark uppercase tracking-widest mb-8">NOTAS / DIARIO</h2>
        <div class="page-number">Página 9</div>
    </div>

</body>
</html>`;
