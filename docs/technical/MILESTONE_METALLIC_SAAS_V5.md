# INFORME MAGNO DE INGENIERÍA Y DISEÑO: "MÉTODO ACTIVA" (SaaS Edition v5.0)

**CLASIFICACIÓN: MILESTONE MASTER / RESTORE POINT**
**FECHA:** 02 de Enero, 2026
**ESTADO:** STABLE / PRODUCTION READY
**HASH VISUAL:** METALLIC-LIGHT-V5-PARTICLES

---

## 1. RESUMEN EJECUTIVO Y PROPÓSITO DEL DOCUMENTO

Este documento actúa como el "Genoma Digital" del sistema CRM "Método Activa" en su versión 5.0. Su propósito es doble:

1.  **Cristalización de Diseño:** Documentar exhaustivamente cada decisión estética, código de color, efecto visual y comportamiento de interfaz que constituye la experiencia "Metallic Light Premium".
2.  **Protocolo de Restauración:** Servir como guía infalible para reconstruir el sistema exacto en caso de pérdida catastrófica de código o desviación no deseada del diseño.

La versión 5.0 representa el abandono de la estética "Dark Mode" en favor de una identidad **"Clínica, Metálica y Luminosa"**. El objetivo es transmitir higiene, precisión quirúrgica y una sofisticación tecnológica que justifique un pricing "High-Ticket".

---

## 2. EL SISTEMA DE DISEÑO: "METALLIC VISUAL TRUST"

El lenguaje visual del sistema ha sido reescrito desde cero. Ya no es una aplicación web estándar; es un entorno que simula materiales físicos de alta gama (Aluminio, Vidrio, Titanio) en un contexto digital.

### 2.1. Filosofía de Materiales

El sistema imita la interacción de la luz sobre superficies metálicas satinadas.

- **La Base:** No es blanco plano (`#FFFFFF`). Es un `Slate-50` (`#F8FAFC`) con texturas sutiles.
- **Los Marcos (Frames):** Cada contenedor (Login Card, Sidebar, Modales) está encapsulado en un "Marco de Plata". Esto se logra mediante bordes de 1px con colores semitransparentes (`border-slate-200/60`) y sombras de alta difusión.
- **El Vidrio (Glassmorphism):** Se utiliza no para difuminar fondos caóticos, sino para crear capas de profundidad sobre el metal. El Sidebar es un bloque de cristal esmerilado (`backdrop-blur-xl`) sobre una base blanca al 80%.

### 2.2. Paleta de Color Definitive (Hex Codes)

Esta paleta es INMUTABLE. Cualquier desviación rompe la armonía "Premium".

**PRIMARIOS (MARCA):**

- `ACTIVA_MAGENTA`: `#EC008C` (Pantone Process Magenta C). Usado para acciones primarias, logos y acentos de "latido".
- `ACTIVA_DEEP`: `#BE185D` (Pink-700). Usado para gradientes de profundidad en botones.

**NEUTROS (FONDOS Y TEXTOS):**

- `TITANIUM_WHITE`: `#FFFFFF` (Fondos de tarjetas).
- `ALUMINIUM_LIGHT`: `#F8FAFC` (Slate-50). Fondo general de la App.
- `STEEL_GRAY`: `#94A3B8` (Slate-400). Iconos inactivos y textos secundarios.
- `CARBON_BLACK`: `#0F172A` (Slate-900). Textos de títulos y navegación.

**ACENTOS SEMÁNTICOS:**

- `CLINICAL_EMERALD`: `#10B981`. Indicadores de éxito y seguridad (Shields, Checks).
- `ALERT_AMBER`: `#F59E0B`. Estados de deuda o advertencia.

### 2.3. Activos 3D (The "Dreamy" Layer)

El sistema depende críticamente de dos activos generados por IA que no pueden ser sustituidos por CSS puro:

1.  **Login Background (`login-bg-metallic.png`)**:
    - _Descripción:_ Una superficie abstracta de metal líquido plateado con profundidad de campo desenfocada.
    - _Elemento Clave:_ Partículas de "Polvo de Neón Rosa" (#EC008C) suspendidas en el aire. Estas partículas conectan el frío del metal con la calidez humana de la marca.
    - _Tratamiento:_ Se renderiza a pantalla completa con `object-cover`. Se le aplica un overlay blanco (`bg-white/30`) con `mix-blend-overlay` para garantizar que el contraste del texto nunca se vea comprometido.

2.  **Dashboard Background (`dashboard-bg-metallic.png`)**:
    - _Descripción:_ Textura de "Aluminio Aeronáutico" con líneas geométricas sutiles.
    - _Opacidad:_ Se renderiza al 60% (`opacity-60`) sobre un fondo `bg-slate-100`.
    - _Propósito:_ Eliminar la sensación de "página web vacía" y dar al terapeuta la sensación de estar operando una máquina sofisticada.

---

## 3. ARQUITECTURA DE COMPONENTES DE INTERFAZ (UI ARCHITECTURE)

A continuación, se detalla la construcción anatómica de los componentes críticos. Si el sistema se reconstruye, debe seguirse esta topología.

### 3.1. LoginView (`src/auth/LoginView.tsx`)

El portal de entrada. No es solo un formulario; es la primera impresión de autoridad.

- **Layout:** Centrado absoluto (`flex items-center justify-center`).
- **The Card (La Tarjeta):**
  - Ancho máximo: `460px` (Optimizado para evitar el ojo de pez en monitores anchos).
  - Material: `bg-white/80` + `backdrop-blur-xl`.
  - Borde: `border-white/50` + `ring-1 ring-white/60`.
  - Sombra: `shadow-2xl` (Difusa, no dura).
- **Efectos de Iluminación (CSS Tricks):**
  - _Top Highlight:_ Un div absoluto de 1px de alto con gradiente `from-transparent via-white to-transparent`. Simula la luz de techo reflejándose en el borde superior del metal.
  - _Bottom Reflection:_ Un div similar en la parte inferior con `via-slate-300`, simulando el reflejo de la mesa.
- **Logotipo:**
  - Configuración: ICONO CIRCULAR + TEXTO.
  - Icono: Contenedor de 40x40px (`w-10 h-10`), `rounded-full`.
  - Gradiente Icono: `from-[#EC008C] to-pink-600`.
  - Sombra Icono: `shadow-lg shadow-pink-500/20`.
  - Texto: "MÉTODO" (Slate-800, Black) + "ACTIVA" (#EC008C). Alineación horizontal perfecta.
- **Inputs (Formulario):**
  - Estilo "Hundido": Gradiente vertical sutil `from-slate-50 to-white`.
  - Iconografía: Iconos (Lock, Shield) a la izquierda, color gris pálido que se vuelve Rosa (#EC008C) cuando el usuario hace foco en el input (`group-focus-within`).

### 3.2. La Barra Lateral "Glass" (`src/layout/Sidebar.tsx`)

El centro de comando. Debe sentirse flotante pero sólido.

- **Estado:** Plegable (Collapsed/Expanded). Transición `duration-500 ease-out`.
- **Material:** `bg-white/80` + `backdrop-blur-xl`.
- **Separador:** `border-r border-slate-200`.
- **Logo Header:**
  - Diferente al Login. Aquí usamos la versión "Compacta Corporativa".
  - Icono: 36x36px (`w-9 h-9`).
  - Texto: "ACTIVA" + Label "ENTERPRISE" (Texto diminuto, tracking 0.2em, color rosa).
- **Items de Navegación:**
  - Estado Inactivo: Texto gris (`text-slate-500`), fondo transparente.
  - Estado Activo:
    - Fondo: Gradiente horizontal `from-slate-100 to-white`.
    - Texto: Rosa `#EC008C`.
    - Indicador: Una barra vertical (`h-8 w-1`) en el borde izquierdo, con sombra de neón (`shadow-[0_0_8px_#EC008C]`). Esta "luz" indica la posición activa.
    - Icono: Escala al 110% (`scale-110`) y aumenta su grosor de trazo (`strokeWidth={2.5}`).

### 3.3. App Layout (`src/layout/AppLayout.tsx`)

El contenedor maestro.

- **Responsabilidad:** Mantener el fondo persistente.
- **Z-Index Strategy:**
  - Z-0: Imagen de fondo (`dashboard-bg-metallic.png`).
  - Z-0 (Layer 2): Overlay blanco al 40% (`bg-white/40`) para asegurar que el texto del contenido principal (tablas, gráficos) sea legible sobre la textura metálica.
  - Z-10: `Sidebar` y `Main Content`.
- **Content Area:** Padding responsivo (`p-4 md:p-8`). Animación de entrada `animate-in fade-in slide-in-from-bottom-4` cada vez que cambia la ruta.

---

## 4. FUNCIONALIDADES CRÍTICAS Y LÓGICA DE NEGOCIO (LOGIC CORE)

Bajo la capa visual "Metallic", el sistema ejecuta una lógica clínica compleja que **debe preservarse intacta**.

### 4.1. El Motor de Admisión (Patient Admission)

- **Auto-Referencia:** El sistema genera IDs únicos (ej. `JP-240102`) combinando iniciales y fecha. _Lógica:_ `useEffect` que observa `name` y `admissionDate`. No permitir edición manual salvo override explícito.
- **ISO Musical:** Campos específicos para "Identidad Sonora". No son text-areas simples; son campos indexables para futuras búsquedas semánticas.

### 4.2. El Radar Cognitivo (SVG Engine)

La visualización en pentágono/hexágono de los 6 dominios cognitivos (Memoria, Atención, Lenguaje, etc.).

- **Tecnología:** SVG puro generado matemáticamente. Sin librerías de gráficos pesadas.
- **Cálculo:** `x = center + radius * cos(angle)`.
- **Capas:**
  1.  _Línea Base (Gris):_ La primera evaluación del paciente.
  2.  _Actual (Rosa):_ La evaluación presente.
      _La superposición visual (Pink over Grey) es el principal KPI de éxito terapéutico visual._

### 4.3. Sistema de Sesiones y Facturación

- **Pricing Dinámico:** Cada tipo de sesión tiene un precio base en `clinicSettings`.
- **Cálculo de Deuda:** `reduce` array de sesiones inpagadas. Alerta visual roja y ámbar en el dashboard si `deuda > 0`.
- **Generador PDF (Browser Native):**
  - Utiliza `@media print`.
  - Oculta Sidebar y Botones.
  - Reordena el DOM para simular un papel A4 milimetrado.
  - _Ventaja:_ Privacidad total (el PDF se genera en el dispositivo, no en un servidor).

---

## 5. STACK TECNOLÓGICO Y FLUO DE DATOS

- **Frontend Library:** React 18.2 (Functional Components, Hooks).
- **Language:** TypeScript 5.x (Strict Mode).
- **Build System:** Vite 5.x (ESBuild).
- **Styling:** Tailwind CSS 3.4 (Utility First) + CSS Modules (para efectos 3D específicos).
- **Backend / Persistence:**
  - _Modo Híbrido:_ "Local First".
  - _Persistencia:_ Hook `useLocalStorage` con serialización JSON.
  - _Sync:_ Preparado para Firebase Firestore (SDK Modular v9). El código de conexión está en `src/lib/firebase.ts` pero envuelto en try/catch para permitir funcionamiento offline.

---

## 6. GUÍA DE RECUPERACIÓN DE DESASTRES (DISASTER RECOVERY)

**ESCENARIO 1: LA INTERFAZ SE "ROMPE" O PIERDE EL ESTILO PREMIUM.**

1.  **Restaurar Assets:** Verificar que `login-bg-metallic.png` y `dashboard-bg-metallic.png` están en `src/assets`. Si faltan, el diseño colapsa a blanco plano.
2.  **Revisar GlobalStyles:** Verificar que `src/theme/GlobalStyles.tsx` está inyectando las variables CSS correctas (`--primary: #EC008C`).
3.  **Revertir Componentes:** Copiar y pegar el código fuente de `LoginView.tsx` y `Sidebar.tsx` desde los bloques de código preservados en los logs (Artifacts).

**ESCENARIO 2: PÉRDIDA DE DATOS DEL PACIENTE.**

1.  **Local Storage:** Los datos viven en el navegador del usuario visible en `Application > Local Storage > crm_data`.
2.  **Exportación:** Instruir siempre al usuario a usar el botón "Exportar Base de Datos (JSON)" semanalmente desde el panel de configuración.

---

## 7. CONCLUSIÓN VISUAL

La versión 5.0 "Metallic Light" ha logrado el equilibrio perfecto entre **Estética** (Belleza, Materialidad) y **Función** (Claridad, Contraste).

- **El Metal** sugiere robustez y tecnología.
- **El Blanco/Luz** sugiere higiene clínica y transparencia.
- **El Rosa (#EC008C)** inyecta la vida, la emoción y la marca humana en el centro de la máquina.

Este documento certifica que el sistema ha alcanzado su "Estado del Arte". Cualquier modificación futura debe construirse SOBRE estos cimientos, nunca demolerlos.

**FIN DEL INFORME MAGNO.**
