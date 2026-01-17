<div align="center">
  <img src="docs/assets/logo.png" alt="Activa Logo" width="180" style="border-radius: 50%" />
  <h1>MÉTODO ACTIVA™</h1>
  <p><strong>SOVEREIGN CLINICAL OPERATING SYSTEM</strong></p>

  <!-- STANDARD BADGES -->
  <p>
    <img src="https://img.shields.io/badge/TITANIUM-STANDARD-0f172a?style=for-the-badge&logo=shield&logoColor=38bdf8" />
    <img src="https://img.shields.io/badge/SECURITY-PASSED-b91c1c?style=for-the-badge&logo=fortinet&logoColor=white" />
    <img src="https://img.shields.io/badge/VERSION-2.4.0-blue?style=for-the-badge&logo=git&logoColor=white" />
  </p>

  <p>
    <a href="https://activamusicoterapia.com"><strong>OFFICIAL SITE</strong></a> •
    <a href="https://webycrm-activa.web.app"><strong>LIVE PLATFORM</strong></a> •
    <a href="mailto:info@activamusicoterapia.com"><strong>CONTACT</strong></a>
  </p>
</div>

---

## 🏛️ THE MANIFESTO

**Método Activa COS (Clinical Operating System)** is a vertical infrastructure engineered for high-performance Neurorehabilitation.

*   **Zero Rent**: We own the code. No per-seat licenses.
*   **Zero Leakage**: Patient data remains in our sovereign cloud.
*   **Zero Latency**: Offline-first architecture ("Bunker Mode").

> *"We don't rent our tools. We forge them."*

---

## 📸 PRODUCT SHOWCASE

### 1. THE COMMAND CENTER (CRM)
Real-time clinical dashboard.

<div align="center">
  <img src="docs/showcase/dashboard_preview.jpg" alt="CRM Dashboard" />
</div>

<br/>

### 2. PATIENT COMPANION (Mobile PWA)
Native-grade performance on iOS & Android. Offline-first architecture for continuity of care.

<div align="center">
  <img src="docs/showcase/mobile_preview_dark.jpg" width="400" alt="Mobile App" style="border-radius: 24px;" />
</div>

<br/>

### 3. THE CORPORATE PORTAL
High-conversion patient acquisition.

<div align="center">
  <img src="docs/showcase/web_landing.jpg" alt="Web Landing" />
</div>

---

## 💎 TITANIUM ENGINEERING

This project follows the **Titanium Protocol**:

| PILLAR | TECHNOLOGY | BENEFIT |
| :--- | :--- | :--- |
| **Language** | TypeScript (Strict) | 0% Runtime Crashes |
| **Data** | Firestore + Security Rules | Zero-Trust Security |
| **Continuity** | IndexedDB (Offline) | Works without Internet |
| **Deploy** | GitHub Actions | Automated & Atomic |

---

## 🏗️ SYSTEM ARCHITECTURE

```mermaid
graph TD
    subgraph CLOUD [Google Sovereign Cloud]
        DB("Firestore NoSQL")
        Auth("Identity Platform")
        Edge("Global CDN")
    end

    subgraph APPS [Client Layer]
        Web("Corporate Web")
        CRM("Clinical Dashboard")
        Mobile("Patient App")
    end

    Web --> Edge
    CRM --> Edge
    Mobile --> Edge
    
    Edge <--> Auth
    Edge <--> DB
```

---

## 🛡️ FORENSIC AUDIT (JAN 2026)

*   **Lines of Code**: 177,419
*   **Critical Leaks**: 0
*   **Legacy Code**: Removed
*   **Status**: Golden Release

---

<div align="center">
  <p><strong>MÉTODO ACTIVA S.L.</strong><br/>
  Strictly Confidential. Commercial Asset.</p>
  <a href="mailto:info@activamusicoterapia.com">info@activamusicoterapia.com</a>
</div>
