# Método Activa CRM

**Plataforma Clínica de Neuro-Rehabilitación**

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Firebase-blue)

## 🏥 Acerca del Proyecto
Método Activa CRM es una solución tecnológica avanzada diseñada para musicoterapeutas y profesionales de la neuro-rehabilitación. Permite la gestión integral de pacientes, seguimiento clínico (ISO, SOAP), facturación automatizada y seguridad de datos cumpliendo estándares sanitarios.

## 🚀 Características Principales
- **Gestión de Pacientes:** Expedientes clínicos digitales con persistencia segura.
- **Identidad Sonora (ISO):** Herramienta especializada para musicoterapia.
- **Facturación Automática:** Generación de facturas PDF y seguimiento de pagos.
- **Protocolos de Seguridad:** Alertas de riesgos (Epilepsia, Disfagia, Fuga).
- **Modo PWA:** Instalable en dispositivos móviles (Android/iOS) con soporte offline.

## 🛠️ Stack Tecnológico
- **Frontend:** React 18, TypeScript, TailwindCSS.
- **Build Tool:** Vite 5 (Optimizada para PWA).
- **Backend (BaaS):** Firebase (Auth, Firestore, Storage, Cloud Functions).
- **Estado:** React Query + Context API.
- **UI:** Lucide Icons, Componentes modulares "Titanium".

## 📦 Instalación y Desarrollo

### Prerrequisitos
- Node.js v18+
- NPM o Yarn

### Pasos
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/metodo-activa-crm.git
   cd metodo-activa-crm
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar Variables de Entorno:
   Crear un archivo `.env` basado en el ejemplo y añadir tus credenciales de Firebase.

4. Ejecutar en Desarrollo:
   ```bash
   npm run dev
   ```

## 📱 PWA y Despliegue
La aplicación está configurada como una Progressive Web App (PWA).
Para construir la versión de producción:

```bash
npm run build
```

Para desplegar en Firebase Hosting:
```bash
firebase deploy --only hosting
```

## 🔒 Seguridad y Privacidad
Este software sigue principios de "Privacy by Design".
- Los datos clínicos están encriptados en tránsito y reposo.
- La autenticación requiere verificación estricta.
- No se almacenan datos sensibles en localStorage sin protección.

---
© 2024 Método Activa. Reservados todos los derechos.
