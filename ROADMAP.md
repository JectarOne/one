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

Proposed order once unblocked (guide's sprint model, applied to the realistic **Client Portal**):
- [ ] Phase 3 — Architecture: schema, API, auth flow, RBAC, multi-tenancy, deployment (approve before code)
- [ ] Sprint 1 — Auth, Organizations, Multi-tenancy, User Management
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
