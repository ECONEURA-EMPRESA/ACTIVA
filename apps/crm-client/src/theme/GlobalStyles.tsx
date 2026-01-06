export const GlobalStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700&display=swap');
    
    :root {
      --primary: #EC008C;
      --primary-dark: #be0070;
      --primary-light: #fdf2f8;
      --bg-app: #F3F6F9; /* Fondo clínico suave */
      --surface: #FFFFFF;
      --text-main: #1E293B;
      --text-muted: #64748B;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-3d: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
    }

    body { 
      font-family: 'Inter', sans-serif; 
      background-color: var(--bg-app); 
      color: var(--text-main); 
      -webkit-font-smoothing: antialiased;
      margin: 0;
      padding: 0;
    }

    /* Scrollbar premium */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

    /* Animaciones suaves */
    .fade-enter { opacity: 0; transform: translateY(10px); }
    .fade-enter-active { opacity: 1; transform: translateY(0); transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1); }

    /* Inputs con sensación de profundidad */
    .input-pro { 
      width: 100%; 
      background: #FFFFFF; 
      border: 1px solid #E2E8F0; 
      border-radius: 0.75rem; /* Más redondeado */
      padding: 0.875rem 1rem; 
      font-size: 0.9rem; 
      color: #1E293B; 
      transition: all 0.2s ease; 
      box-shadow: var(--shadow-sm);
    }
    .input-pro:focus { 
      border-color: var(--primary); 
      outline: none; 
      box-shadow: 0 0 0 4px rgba(236, 0, 140, 0.15), var(--shadow-sm); 
      transform: translateY(-1px);
    }
    .input-pro::placeholder { color: #94A3B8; }

    .label-pro { 
      display: block; 
      font-size: 0.75rem; 
      font-weight: 700; 
      text-transform: uppercase; 
      letter-spacing: 0.05em; 
      color: #475569; 
      margin-bottom: 0.5rem; 
    }

    /* Tarjetas con efecto 3D */
    .card-clinical {
      background: white;
      border-radius: 1rem;
      border: 1px solid rgba(255,255,255,0.5);
      box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.05), 
        0 2px 4px -1px rgba(0, 0, 0, 0.03),
        0 0 0 1px rgba(0,0,0,0.02); /* Borde sutil */
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card-hoverable:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-3d);
      border-color: rgba(236, 0, 140, 0.2);
    }

    /* Botones con gradiente sutil y sombra */
    .btn-primary {
      background: linear-gradient(135deg, #EC008C 0%, #C20072 100%);
      box-shadow: 0 4px 10px rgba(236, 0, 140, 0.3);
      border: none;
      color: white;
    }
    .btn-primary:hover {
      box-shadow: 0 6px 15px rgba(236, 0, 140, 0.4);
      transform: translateY(-1px);
    }
    .btn-primary:active {
      transform: translateY(1px);
      box-shadow: 0 2px 5px rgba(236, 0, 140, 0.2);
    }

    /* --- REGLAS DE IMPRESIÓN CRÍTICAS --- */
    @media print {
      @page { margin: 0; size: auto; }
      body { background: white; }
      .no-print, .sidebar, .mobile-header, header, aside { display: none !important; }
      .print-only { display: block !important; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; background: white; }
      .invoice-preview-container { position: static !important; width: 100% !important; height: auto !important; overflow: visible !important; }
      .invoice-paper { box-shadow: none !important; margin: 0 !important; width: 100% !important; max-width: none !important; border: none !important; }
    }
    `,
    }}
  />
);
