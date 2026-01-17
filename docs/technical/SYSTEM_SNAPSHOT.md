# System Snapshot v1.0 (Stable Release)

**Date:** 2026-01-02
**Status:** ✅ OPERATIONAL / VERIFIED LOCALLY & LIVE
**Project ID:** `webycrm-activa`
**Live URL:** [https://activamusicoterapia.com](https://activamusicoterapia.com)

---

## 🚨 CRITICAL CONFIGURATION (Do Not Lose)

This specific configuration is the **ONLY** one that works. Any deviation (typos, wrong project ID) will crash the auth system.

### Correct Environment Variables (`apps/crm-client/.env.local`)

_These values successfully authenticate against Google Identity Platform._

```env
VITE_FIREBASE_API_KEY=AIzaSy... (Redacted)
VITE_FIREBASE_AUTH_DOMAIN=app-activamusicoterapia.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=app-activamusicoterapia
VITE_FIREBASE_STORAGE_BUCKET=app-activamusicoterapia.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:...ee7b138dd10039
VITE_API_URL=https://crm-api-prod-679548176188.europe-west1.run.app
```

### ⚠️ Known "Landmines" (Avoid These Mistakes)

1.  **NEVER create `.env.production`**: We discovered that Vite prioritizes this file over `.env.local` during builds. If it exists with old keys, the deployment **will fail silently** (showing old keys in production).
    - _Action taken:_ Deleted `apps/crm-client/.env.production`.
2.  **API Key Typos**: The key ending in `...Cn4` (provided manually previously) was incorrect. The key ending in `...cn4` (lowercase 'c', but distinctly different middle characters) retrieved from `gcloud` is the correct one.
    - _Correct Key:_ `...zZHYlI35lTD0zo3Ocn4`
3.  **Browser Cache**: Clients must hard-reload after deployment if they see "Invalid API Key" errors, as the cache is aggressive.

---

## 🏗️ Deployment Architecture

### 1. Frontend (Firebase Hosting)

- **Source:** `apps/crm-client`
- **Build Command:** `npm run build` (uses `tsc && vite build`)
- **Output:** `apps/crm-client/dist`
- **Hosting Config:** `firebase.json` rewrites everything to `index.html`.

### 2. Backend (Cloud Run)

- **Source:** `apps/backend-api`
- **Docker:** Standard Node.js image (Non-Turborepo optimized to avoid context issues).
- **Service Name:** `crm-api-prod`
- **Region:** `europe-west1`

### 3. Database (Firestore)

- **Location:** `europe-west1`
- **Mode:** Native/Production
- **Security Rules:** Currently allow read/wire for auth users (Standard).

---

## 🔄 Recovery Procedure (If it breaks)

If the system ever stops working or you move to a new machine:

1.  **Clone/Open** this repo.
2.  **Restore `.env.local`**: Copy the variables above into `apps/crm-client/.env.local`.
3.  **Clean Install**:
    ```powershell
    rm -r apps/crm-client/dist
    rm -r apps/crm-client/node_modules
    npm install
    ```
4.  **Verify Key**:
    ```powershell
    # Check if the build is picking up the right key BEFORE deploying
    npm run build -w apps/crm-client
    Select-String -Path apps\crm-client\dist\assets\index-*.js -Pattern "AIzaSyAFCYMKWRi"
    ```
5.  **Deploy**:
    ```powershell
    firebase deploy --project metodo-activa-saas-1767353295
    ```

---

## 📜 Version History

- **v1.0 (Current):**
  - Removed old project artifacts (`2512...`).
  - Standardized on Project ID `1767...`.
  - Authentic API Key retrieved via Forensic CLI.
  - Verified Registration & Login Flows (Google + Email).
