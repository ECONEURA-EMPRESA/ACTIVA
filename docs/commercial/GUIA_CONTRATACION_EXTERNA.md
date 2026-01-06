# 🛒 GUÍA PASO A PASO: ECOSISTEMA 100% GOOGLE

Has elegido la opción más robusta y cómoda: **Todo unificado en Google**.
Esto simplifica la facturación y mejora la velocidad de conexión.

---

## 1. 💳 ACTIVAR GOOGLE CLOUD (Hosting + Billetera)

Este es el paso fundamental. Google Cloud será tu "Caja Central" desde donde se paga tanto el servidor como el dominio.

1.  Entra en **[console.cloud.google.com/freetrial](https://console.cloud.google.com/freetrial)**.
2.  Inicia sesión con tu cuenta de Gmail.
3.  Selecciona **País: España**.
4.  Introduce tu **Tarjeta de Crédito/Débito** o cuenta bancaria.
    - _Nota:_ Esto habilita tu "Cuenta de Facturación". Todos los gastos (servidor y dominio) se cargarán a esta única tarjeta.
5.  Ve al menú (tres rayas) > **Facturación (Billing)**.
6.  Copia el **"ID de cuenta de facturación"** (`XXXXXX-XXXXXX-XXXXXX`).
    - 👉 **ANÓTALO**. Lo necesito para activar el servidor.

---

## 2. 🌐 COMPRAR DOMINIO EN GOOGLE (Cloud Domains)

Al comprarlo aquí, la configuración es automática y la renovación se cobra en la misma factura anterior.

1.  Dentro de la misma consola de Google Cloud, busca en la barra superior: **"Cloud Domains"**.
2.  Haz clic en **"Registrar Dominio"**.
    - _Nota:_ Si te dice "Habilitar API", dale a "Habilitar".
3.  Busca tu nombre (ej. `metodoactivacrm.com`).
4.  Selecciona el precio (aprox. 12€/año).
5.  En "Configuración de DNS", selecciona **"Usar DNS de Cloud (Recomendado)"**.
6.  Completa la compra con la cuenta de facturación del Paso 1.
    - 👉 **ANOTA EL NOMBRE EXACTO DEL DOMINIO**.

---

## 3. 📧 SERVICIO DE CORREO (SendGrid)

_Importante:_ Aunque estemos 100% en Google, **Google Cloud NO envía correos transaccionales** (es política anti-spam estricta). Necesitamos este "puente" externo sí o sí.

1.  Ve a **[sendgrid.com](https://sendgrid.com)**.
2.  Haz clic en **"Start for Free"**.
3.  Regístrate.
4.  Ve a **Settings > API Keys** > **Create API Key**.
5.  Dale permisos "Full Access" y **COPIA LA CLAVE (SG...)**.
    - 👉 **GUARDA LA CLAVE**.

---

## ✅ TU LISTA DE ENTREGA

Para proceder, solo necesito que pegues aquí estos 3 datos:

1.  **Billing ID de Google:** `______-______-______`
2.  **Nombre de Dominio (comprado en Cloud Domains):** `tu-dominio.com`
3.  **SendGrid API Key:** `SG.xxxxxxxxxxxxxxxx...`

Con esto, yo podré configurar el servidor y conectar el dominio automáticamente sin que tengas que tocar configuraciones DNS manuales.
