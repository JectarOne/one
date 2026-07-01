# JectarOne — Roadmap

Consolidated roadmap. Marketing/consultancy track is live and incremental; the SaaS track is **gated on the decisions in `docs/blueprint/ANALYSIS.md` §7** and not started.

## Track A — Consultancy website (LIVE, incremental)
- [x] Honest consultancy site + design system
- [x] Blog (14 articles) + free tools (5) + Report Builder + Company Profile PDF
- [x] Security headers, security.txt, brand assets, contact form (SMTP)
- [ ] Owner: verify contact email delivery on server; create LinkedIn + Google Business
- [ ] More pillar articles (EDR/XDR, MITRE ATT&CK, Linux hardening, threat hunting)
- [ ] Resource center (needs decision: gated email-capture vs open downloads)
- [ ] Finish docs portal content (honest, product-preview framed)

## Track B — Product / SaaS (NOT STARTED — awaiting approval)
Per the Execution Guide, no code until analysis + architecture are approved.

**Blocking decisions (ANALYSIS §7):** product scope (Client Portal vs real EDR) + hosting/stack.

**Decisions made (2026-07-01):** product = **Client Portal**; hosting = **new app hosting** (Next.js + Postgres + Vercel, separate from this static repo). The portal lives in its **own repo/dir**: `../jectarone-portal` (Next.js 15 + Prisma + JWT auth).

Order (guide's sprint model, applied to the realistic **Client Portal**):
- [x] Phase 3 — Architecture (see `jectarone-portal/ARCHITECTURE.md`)
- [x] Sprint 1 — Auth, Organizations, Multi-tenancy, User Management ✅ built + verified (commit 0eec0f9 in the portal repo; not yet pushed to a remote)
- [ ] Sprint 2 — RBAC, Dashboard shell, Navigation, Layout
- [ ] Sprint 3 — Client assessments & findings (grows the existing Report Builder into a persisted, multi-user tool)
- [ ] Sprint 4 — Reports, risk matrix, exports
- [ ] Sprint 5 — Notifications, audit logs
- [ ] Sprint 6 — Billing, API keys
- [ ] Sprint 7 — Documentation portal, developer API docs (once a real API exists)

> Endpoint agents / live threat detection (real EDR) are treated as long-term / out of scope unless explicitly chosen in ANALYSIS §7-A, given the team-years cost and maintenance/security burden.

## Guardrails (from the guide + prior approvals)
- Honest by default — no fake data/logos/testimonials presented as real; mock UI stays labeled.
- Reuse existing components; keep the approved architecture; no unnecessary refactors.
- Update `README.md`, `ROADMAP.md`, `CHANGELOG.md`, `PROJECT_MEMORY.md` after each feature.
