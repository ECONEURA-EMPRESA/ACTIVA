# INFORME TÉCNICO MAGNO: ARQUITECTURA DE NUBE Y GESTIÓN DE DATOS

## ECOSISTEMA "MÉTODO ACTIVA SaaS" - GOOGLE CLOUD PLATFORM

**CLASIFICACIÓN:** D-01 (CONFIDENCIAL)
**FECHA:** ENERO 2024
**AUTOR:** EQUIPO DE INGENIERÍA ANTIGRAVITY

---

## ÍNDICE DE CONTENIDOS

1.  **RESUMEN EJECUTIVO**
2.  **IDENTIDAD Y GOBERNANZA DEL USUARIO (IAM & DATA PRIVACY)**
3.  **ARQUITECTURA DE SERVICIOS GOOGLE CLOUD (THE CLOUD UNIVERSE)**
    - 3.1. Cómputo Serverless (Cloud Run)
    - 3.2. Persistencia NoSQL (Cloud Firestore)
    - 3.3. Almacenamiento de Objetos (Cloud Storage)
    - 3.4. Seguridad e Identidad (Identity Platform)
    - 3.5. Ciclo de Vida del Software (CI/CD)
4.  **ESTRATEGIA DE SEGURIDAD Y CUMPLIMIENTO (GDPR/HIPAA)**
5.  **PLAN DE ESCALABILIDAD Y COSTOS**
6.  **CONCLUSIÓN TÉCNICA**

---

## 1. RESUMEN EJECUTIVO

Este documento detalla la infraestructura tecnológica que soporta la plataforma "Método Activa SaaS". Hemos diseñado una arquitectura **"Cloud Native"** utilizando exclusivamente servicios gestionados de Google Cloud Platform (GCP).

**¿Por qué Google Cloud?**
A diferencia de servidores tradicionales (VPS), la arquitectura elegida no requiere mantenimiento de sistemas operativos, parches de seguridad ni gestión de hardware. Es una infraestructura "Serverless" (sin servidor) que escala automáticamente desde 0 usuarios hasta millones, cobrando solo por el uso exacto (segundos de cómputo y gigabytes almacenados).

**Objetivo del Diseño:**
Crear un entorno de **Grado Médico** donde la privacidad del paciente, la integridad de los datos clínicos y la disponibilidad del servicio están garantizadas por los mismos centros de datos que operan Google Search y YouTube.

---

## 2. IDENTIDAD Y GOBERNANZA DEL USUARIO

La gestión de la identidad es la piedra angular de cualquier aplicación SaaS (Software as a Service) Multi-Tenant. "Método Activa" distingue entre dos tipos de "Usuarios":

### 2.1. El Usuario Operador (El Terapeuta/Cliente)

Es el profesional que paga por el servicio y utiliza la plataforma.

- **Datos Recopilados:** Email corporativo, Nombre Completo, Rol (Admin/Terapeuta), ID de la Organización (Tenant ID).
- **Mecanismo de Autenticación:** Utilizamos **Google Identity Platform** (anteriormente Firebase Auth).
  - _Ventaja:_ No almacenamos contraseñas en nuestra base de datos. Delegamos la criptografía de claves a Google.
  - _MFA:_ Soporte nativo para Autenticación de Doble Factor (2FA) si se requiere.
  - _Tokens:_ Gestión automática de JWT (JSON Web Tokens) para sesiones seguras de 1 hora.

### 2.2. El Usuario Paciente (El Beneficiario)

Es el sujeto pasivo sobre el que se registran datos clínicos.

- **Datos Recopilados:** Nombre, Apellidos, Fecha de Nacimiento, Diagnóstico Neurocognitivo, Historial de Música (ISO), Puntuaciones de Tests (MOCA, GDS).
- **Privacidad (Pseudo-anomización):**
  - El sistema genera automáticamente un **Código de Referencia Único** (ej. "JP-240115") basado en las iniciales.
  - Esto permite a los investigadores o auditores hablar sobre casos clínicos sin revelar la identidad real del paciente en reportes exportados.
- **Derecho al Olvido:** Implementamos el "Borrado Lógico" (Soft Delete) para archivar pacientes, y el "Borrado Físico" (Hard Delete) para cumplir con solicitudes GDPR estrictas, eliminando en cascada todos los registros asociados.

---

## 3. ARQUITECTURA DE SERVICIOS GOOGLE CLOUD (THE CLOUD UNIVERSE)

Hemos seleccionado un stack tecnológico "Best-in-Class". Cada servicio ha sido elegido por su capacidad de escalar y su seguridad.

### 3.1. Cómputo Serverless: Google Cloud Run

Es el "cerebro" donde vive la aplicación Backend (API) y, potencialmente, el servidor de renderizado Frontend.

- **Tecnología:** Contenedores Docker. Empaquetamos todo el código (Node.js/Express) en una caja inmutable.
- **Función:** Procesa las peticiones lógicas (ej. "Guardar Sesión", "Calcular Factura").
- **Escalado a Cero:** Si nadie usa la app de noche, Google apaga los servidores automáticamente (= Coste 0€). Al llegar la primera petición de la mañana, el servidor despierta en milisegundos.
- **Seguridad:** Tráfico encriptado TLS 1.3 (HTTPS) forzado automáticamente con certificados gestionados por Google.

### 3.2. Persistencia NoSQL: Cloud Firestore

Es la "memoria" del sistema. Una base de datos documental moderna y ultrarrápida.

- **Modelo de Datos:** No usa tablas Excel rígidas (SQL). Usa "Documentos" JSON flexibles organizados en "Colecciones".
  - _Colección `tenants`:_ Datos de las clínicas suscritas.
  - _Colección `patients`:_ Expedientes clínicos.
  - _Colección `sessions`:_ Bitácoras diarias.
- **Real-Time:** Firestore permite que los cambios (ej. un terapeuta actualiza una nota) se reflejen **instantáneamente** en la pantalla de otro terapeuta sin recargar la página (WebSockets).
- **Multi-Región:** Los datos se replican automáticamente en varios centros de datos dentro de la región Europa (europe-west1 - Bélgica) para resistir fallos físicos catastróficos.

### 3.3. Almacenamiento de Objetos: Cloud Storage

Es la "caja fuerte" para archivos binarios pesados.

- **Uso:** Almacenar fotos de perfil de pacientes, documentos PDF escaneados, informes de derivación o archivos de audio (Musicoterapia).
- **Seguridad:** Bucket Privado (`public-access-prevention=enforced`). Solo la aplicación, autenticada con una Service Account de Google, puede firmar URLs temporales para mostrar una imagen al usuario autorizado.
- **Clase de Almacenamiento:** "Standard" para acceso frecuente. Políticas de ciclo de vida para mover archivos antiguos a "Coldline" (más barato) tras 365 días.

### 3.4. Infraestructura como Código (Terraform)

No configuramos la nube haciendo "clic" en la consola. Usamos **Terraform**.

- **Archivo Maestro (`main.tf`):** Un archivo de texto que describe la infraestructura deseada.
- **Ventaja:** Permite desplegar un clon exacto del entorno de producción en minutos para pruebas o para un nuevo cliente Enterprise que quiera ("On-Premise Cloud").
- **Auditoría:** Queda registro en Git de quién cambió qué configuración de servidor y cuándo.

### 3.5. Ciclo de Vida: Artifact Registry & Cloud Build

- **Artifact Registry:** Un almacén privado para nuestras imágenes Docker. Nadie fuera de la organización puede ver nuestro código compilado.
- **Cloud Build:** El robot de ensamblaje. Cada vez que hacemos `git push`, Cloud Build:
  1.  Descarga el código.
  2.  Ejecuta pruebas automatizadas.
  3.  Construye el contenedor Docker.
  4.  Lo despliega en Cloud Run.

---

## 4. ESTRATEGIA DE SEGURIDAD Y CUMPLIMIENTO (GDPR / HIPAA)

Dado que tratamos datos de salud (Categoría Especial según RGPD Art. 9), la seguridad no es opcional.

### 4.1. Encriptación

- **En Transito:** Todos los datos viajan por HTTPS con TLS. Es imposible interceptar una contraseña o un nombre de paciente en una red WiFi pública.
- **En Reposo:** Google encripta por defecto todos los datos escritos en disco (Firestore y Storage) usando el estándar AES-256. Ni siquiera los ingenieros de Google con acceso físico a los discos duros pueden leer la información.

### 4.2. Soberanía del Dato

- **Localización:** Hemos forzado la región `europe-west1` (UE). Los datos garantizan no salir del Espacio Económico Europeo, cumpliendo con las sentencias Schrems II.

### 4.3. Control de Acceso (RBAC)

- Implementamos roles estrictos en el código:
  - _Admin:_ Acceso total.
  - _Therapist:_ Acceso de lectura/escritura clínica, pero **sin acceso a borrado destructivo** ni a datos de facturación global.

---

## 5. PLAN DE ESCALABILIDAD

La arquitectura elegida soportaría hipotéticamente 100, 10.000 o 1.000.000 de pacientes sin cambiar una sola línea de código.

- **Cloud Run:** Escala horizontalmente añadiendo miles de "instancias" (mini-servidores) en segundos si hay un pico de tráfico.
- **Firestore:** Diseñado para manejar millones de operaciones por segundo. Es la misma tecnología que usa Google para sus apps globales.
- **CDN (Content Delivery Network):** Los activos estáticos (imágenes del CRM, logos) se sirven desde la red global de caché de Google, asegurando carga instantánea en Madrid, Buenos Aires o Nueva York.

---

## 6. CONCLUSIÓN TÉCNICA

El "Método Activa" no es solo un software; es una fortaleza digital. Al apalancarnos en la infraestructura de Google Cloud Platform, obtenemos capacidades de nivel Enterprise (seguridad bancaria, escalado infinito, redundancia global) con un equipo de operaciones mínimo.

Hemos construido un sistema diseñado para durar décadas, capaz de custodiar la historia clínica de los pacientes con el máximo respeto, seguridad y eficiencia tecnológica disponible en el mercado actual.

**FIRMADO:**
_Antigravity Agentic Engineering Core_
_Lead Cloud Architect_
