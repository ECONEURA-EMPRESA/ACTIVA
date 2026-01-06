<div align="center">
  <br />
  <img src="docs/commercial/assets/premium_app_icon_v6_1767403082859.png" alt="Método Activa Logo" width="140" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />
  <br />
  <br />

  # MÉTODO ACTIVA CRM
  ### The Sovereign Clinical Operating System for Neurorehabilitation.

  [![License](https://img.shields.io/badge/License-Proprietary%20(100%25%20IP)-0F172A.svg)](LICENSE)
  [![Status](https://img.shields.io/badge/Status-Production%20Gold-10B981.svg)](https://metodo-activa-saas-1767353295.web.app)
  [![Tech](https://img.shields.io/badge/Stack-React%2018%20%7C%20TypeScript%20%7C%20Firebase-3B82F6.svg)](docs/technical/SYSTEM_SNAPSHOT.md)
  [![Performance](https://img.shields.io/badge/Lighthouse-99%2F100-F59E0B.svg)](PERFECT_AUDIT_LOG.md)
  [![Audit](https://img.shields.io/badge/Audit-Zero%20Debt-EC4899.svg)](PERFECT_AUDIT_LOG.md)

  <br />
  
  <a href="https://metodo-activa-saas-1767353295.web.app"><strong>🌐 LAUNCH LIVE DEMO</strong></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="docs/commercial/SALES_DECK.md"><strong>📄 INVESTOR DECK</strong></a>
  &nbsp;&nbsp;•&nbsp;&nbsp;
  <a href="docs/technical/SYSTEM_SNAPSHOT.md"><strong>⚙️ TECH SPECS</strong></a>

  <br />
  <br />
</div>

---

## � The Asset (Investment Thesis)

**Método Activa CRM** is a Production-Grade SaaS platform engineered to monopolize the Neurorehabilitation market. 

It is not a prototype. It is a **Turnkey Business System** capable of managing hundreds of clinics immediately. The architecture is "White Label Ready", meaning the engine can be rebranded for other healthcare verticals in days.

| **Unit Economics** | **Value Proposition** |
| :--- | :--- |
| **Serverless**: $0 Fixed Costs. | **Specialized**: First CRM with "Clinical Logic" built-in. |
| **Scalable**: Google Cloud Auto-scale. | **Secure**: HIPAA/GDPR Compliant Architecture. |
| **Stickiness**: High switching costs for clinics. | **Mobile**: Native-like PWA experience (iOS/Android). |

---

## 📸 Visual Intelligence

### The Command Center
*Designed for High-Velocity Clinical Operations. Real-time patient alerts and financial tracking.*
<img src="docs/commercial/assets/dashboard_main_png_1767436996398.png" width="100%" style="border-radius: 8px; border: 1px solid #E2E8F0;" />

---

## 🏗️ "Titanium" Monorepo Architecture

This repository is organized as a Modern Monorepo using `TurboRepo`, ensuring strict boundary enforcement between Business Logic (`shared`) and UI (`apps`).

```mermaid
graph TD
    A[Root: monorepo-crm-activa] --> B(apps/landing-web);
    A --> C(apps/crm-client);
    A --> D(packages/shared);
    A --> E(functions);

    B -- "Corporate Identity" --> User[Public Visitor];
    C -- "Clinical OS" --> Doctor[Medical Staff];
    D -- "Zod Schemas & Types" --> B;
    D -- "Zod Schemas & Types" --> C;
    D -- "Zod Schemas & Types" --> E;
    E -- "Payment & Triggers" --> Cloud[Google Cloud];
```

### Stack Highlights
*   **Engine**: `React 18` + `Vite` (Instant HMR).
*   **Language**: `TypeScript 5.x` (Strict Mode).
*   **Styling**: `Tailwind CSS` + `Radix UI` (Accessible).
*   **Backend**: `Firebase` (Auth, Firestore, Functions, Storage).
*   **Quality**: `ESLint` + `Prettier` + `Husky` (Git Hooks).

---

## ⚔️ Competitive Advantage (Why We Win)

| Feature | Método Activa CRM 🥇 | Generic CRMs (Salesforce/HubSpot) |
| :--- | :---: | :---: |
| **Clinical Logic** | ✅ Native (GDS, FAST, Neuro) | ❌ None (Requires expensive customization) |
| **Data Privacy** | ✅ Private Instance (Own DB) | ❌ Shared Multi-tenant Database |
| **Cost Model** | ✅ Pay-per-use (Serverless) | ❌ High per-seat licensing fees |
| **UX/UI** | ✅ "Apple-grade" Simplicity | ❌ Clunky Enterprise UI |
| **Offline Mode** | ✅ Full PWA Support | ❌ Requires Internet |

---

## 📦 Deployment & Handoff

**Instant Activation Protocol:**
This system is designed for a friction-less handover.

1.  **Clone**: Download the secure repository.
2.  **Install**: `pnpm install` (Installs dependencies for all apps).
3.  **Launch**: `pnpm dev` (Starts Landing + CRM + Functions locally).
4.  **Deploy**: `pnpm build && firebase deploy` (Ship to Global CDN).

---

<div align="center">
  <p><strong>© 2026 ECONEURA / MÉTODO ACTIVA S.L.</strong></p>
  <p><i>Strictly Confidential. Commercial Asset. 100% IP Ownership.</i></p>
</div>
