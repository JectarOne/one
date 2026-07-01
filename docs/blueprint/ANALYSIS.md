# JectarOne — Phase 2 Analysis (per Execution Guide)

> This document is the deliverable the Execution Guide requires **before any code**:
> product understanding, contradictions, missing requirements, technical risks,
> questions, and a proposed roadmap. Nothing is implemented yet — awaiting approval.

**Status:** BLOCKED — see §0. Prepared 2026-07-01.

---

## 0. Blocking issues found immediately

1. **The single source of truth is missing.** The guide says: *"The blueprint documents are the single source of truth. Read every Markdown inside `docs/blueprint/`. Do not start coding until they have been analyzed."* — but `docs/blueprint/` was **empty** (this file is the first thing in it). There are no product blueprint documents to analyze. Per the guide's own rule *"Never invent requirements. Stop when information is missing. Ask instead of guessing,"* I cannot fabricate the product spec. **We need the blueprint docs, or a decision to treat existing roadmap files as the spec.**

2. **The target stack cannot run on the current hosting.** The guide's structure (`apps/dashboard`, `services/api|auth|notifications`, database, multi-tenancy, RBAC, billing) is a Node/DB production SaaS monorepo. The live site is **static HTML on cPanel shared hosting (LiteSpeed + PHP)**, deployed by `git pull`. A Next.js app with an API layer, background services, and a database **cannot be deployed there.** This needs a hosting + stack decision before Sprint 1.

3. **Direction conflict with the founding brief and prior approved decisions.** `jecjec.md`: *"Do NOT create an imaginary SaaS platform. Design as if JectarOne is a real consultancy."* Two sessions ago you approved: **"Keep consultancy + ADD product"** and **"Mock UI, clearly labeled (no fake data presented as real)."** This guide instead asks to build a **real, functional** EDR/XDR-style SaaS (agents, threat detection, alerts). That is a legitimate escalation, but it reverses the "mock, labeled" decision and is a fundamentally larger commitment. Needs explicit confirmation.

---

## 1. Product understanding (as implied by the guide)

A multi-tenant cybersecurity SaaS resembling an EDR/XDR platform:

- **Tenancy & identity:** organizations, users, authentication, RBAC, multi-tenancy.
- **Core product:** endpoint/device inventory, threat detection, alerts, incident details, policies, reports, audit logs.
- **Platform:** notifications, billing, API keys, integrations, developer API.
- **Surrounding:** documentation portal, knowledge base, marketing website, blog, SEO, resource center.

This is a **product company**, not a consultancy website. It is a multi-year build, normally staffed by a team.

## 2. Current state (what actually exists today)

- Static marketing site (honest consultancy positioning): home, about, services, case-studies (demo-labeled), privacy, terms, 404.
- Blog: 14 real cybersecurity articles + hub.
- Free tools: 5 (2 static + 3 PHP, SSRF-hardened).
- **Real** working feature: client-side Assessment Report Builder (`/app/`) → branded PDF.
- **Labeled-mock** interactive product demo (`/product-demo.html`) + product page + a small docs portal stub (`/docs/*.html`).
- Contact form → PHP/SMTP. Security headers, SVG logo, PDF company profile, security.txt.
- Hosting: cPanel static. Repo: `JectarOne/one`, single static site.

## 3. Contradictions

| # | Contradiction | Source |
|---|---------------|--------|
| C1 | "No imaginary SaaS" / "mock, labeled" vs "build real functional SaaS" | jecjec.md + prior approvals vs this guide |
| C2 | Static cPanel hosting vs Node monorepo + DB + services | current infra vs guide Phase 1 |
| C3 | "Blueprints are the only source of truth" vs no blueprints exist | guide Mission vs filesystem |
| C4 | Solo, incremental, ship-small cadence vs 8-sprint enterprise SaaS with tests/CI/CD | observed workflow vs guide |

## 4. Missing requirements (must be provided before building)

- **Product scope reality:** Is this a *real* EDR (endpoint agents collecting telemetry, detection engine) — a genuinely huge, ongoing engineering + threat-research effort — or a **client portal** for the consultancy (clients log in, see their assessments/reports/risk)? These are wildly different in cost and risk. The portal is realistic; a real EDR is not, for a solo/small team.
- Hosting & budget (Vercel/Netlify + managed Postgres? a VPS? containers?).
- Auth approach (roll-your-own vs Auth provider e.g. Clerk/Auth0/Supabase Auth).
- Data model specifics, data residency (Morocco / Law 09-08 implications for storing client security data).
- Billing provider (Stripe availability for Morocco? Paddle?).
- Integrations list, notification channels.
- Team & timeline: who maintains this after it's built?

## 5. Technical risks

- **R1 — Scope.** A real EDR/XDR is a team-years product with continuous threat-intel upkeep. Very high risk for a solo/small effort.
- **R2 — Security liability.** A security product that stores clients' vulnerability data is a high-value target; a breach would be existential for a security brand. Demands real hardening, not a rushed build.
- **R3 — Hosting/stack mismatch.** Nothing in the guide deploys on current hosting; new infra + cost + ops burden.
- **R4 — Maintenance.** Auth, multi-tenancy, RBAC, billing are permanent maintenance load.
- **R5 — Opportunity cost.** Time on a speculative platform is time not spent landing the first 10 consulting clients (the actual Year-1 revenue goal in the strategic roadmap).

## 6. Recommended path (honest, buildable, reversible)

**Do NOT rewrite the static site into a monorepo, and do NOT build a fake-real EDR.** Instead:

1. **Keep the marketing site as-is** (it is `apps/website`, effectively). It works, it's honest, it deploys on cPanel.
2. **Build ONE real product vertical first — a Client Portal** (the realistic version of "the product"), as a **separate application** on **app-capable hosting** (recommended: Next.js + Postgres + a managed auth provider, on Vercel/Neon or a small VPS; served from `app.jectar.one`). This is the honest MVP that helps real consulting clients (log in → view their assessments, findings, risk matrix, download reports) and grows the Report Builder you already have into a persisted, multi-user tool.
3. **Sprint 1 (auth, organizations, multi-tenancy, user management)** targets that portal — not a pretend EDR.
4. Treat endpoint agents / live threat detection as **long-term / out of scope for now** (or keep them as the clearly-labeled demo already built).

This satisfies the guide's *structure and discipline* (vertical features, tracking files, PR checklist, definition of done) while staying honest and actually deployable.

## 7. Decision needed to unblock (single question)

Before Sprint 1 code, confirm **two things**:

- **A. What is "the product"?** → *Client Portal for consulting clients* (realistic, recommended) **or** *a real EDR/XDR platform* (team-years, not recommended solo).
- **B. Where does it run?** → new app hosting (Vercel/VPS + DB) under `app.jectar.one` **or** must it somehow fit cPanel (limits it to PHP + MySQL, no Node).

Once A + B are set, I will produce the Phase 3 architecture (schema, API, auth flow, RBAC, multi-tenancy, deployment) for approval, then build Sprint 1 vertically.

---

*Per the Execution Guide: no code until this analysis and the resulting architecture are approved.*
