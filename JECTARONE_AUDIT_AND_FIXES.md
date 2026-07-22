# Website Audit & Remediation Action Plan: JectarOne (jectar.one)

## Overview
This document outlines actionable technical, UX/UI, CRO, and SEO fixes for **JectarOne** (`https://jectar.one`). 
Use this guide to execute immediate bug fixes, optimize user conversion, and structure localized content for Moroccan SMEs.

---

## Task Checklist for AI Agent (Claude Code)

### Phase 1: Immediate Critical Fixes (Priority: High / 24–48 Hours)

#### 1. Remove Demo Content & Placeholder Testimonials
- [x] **File Location**: Home page / Testimonials component.
- [x] **Issue**: The demo testimonials were already removed in an earlier pass (replaced with an honest "Trusted by" section) — the trust-destroying "Demo" disclaimer is no longer on the homepage.
- [~] **Action** (partial — one part refused for integrity):
  - [x] Added truthful trust badges to the Trusted section: **100% confidential — every engagement NDA-backed**, **ISO 27001 readiness expertise**, **Aligned with Law 09-08 / CNDP**. (Wording kept accurate: "aligned with", not a false "CNDP Certified" claim.)
  - [ ] **REFUSED: fabricating "anonymous real-world case studies"** (e.g. "IT Manager, Financial Services Firm - Casablanca"). Inventing client quotes/profiles and presenting them as real is deceptive and was explicitly rejected earlier. Real references will populate here as clients approve. The honestly-labelled illustrative examples on case-studies.html stay labelled.

#### 2. Consolidate Dual Hero CTAs (CRO Optimization)
- [x] **File Location**: Hero section.
- [x] **Issue**: Fixed — one primary button now.
- [x] **Action**:
  - Kept one primary CTA button: **Request a Security Assessment**. (Did **not** rename to "Request Free Assessment" — the assessment itself is paid; only the initial consultation is free. Claiming a free assessment would mislead.)
  - Demoted the secondary CTA to a subtle text link: *"or book a free consultation"*.

#### 3. Integrate Floating WhatsApp Widget
- [x] **File Location**: Injected before `</body>` on all 43 pages.
- [x] **Issue**: Fixed — one-tap WhatsApp path for local leads.
- [x] **Action**:
  - Floating WhatsApp button, bottom-right, `position: fixed`, WhatsApp green (#25D366), inline SVG (renders without JS).
  - Link: `https://wa.me/212752138075?text=Hello%20JectarOne%2C%20I%20would%20like%20to%20request%20a%20security%20assessment.`
  - Verified on mobile (375px): 52×52 hit area, inside viewport, no horizontal scroll, `overflow-x: clip` intact.

---

### Phase 1 status: **complete** (cache bumped to `?v=20260723b`). Phases 2–3 not started.
- Phase 2 note: an **Arabic RTL toggle placeholder** already exists in the navbar; full `/fr/` `/ar/` i18n routing is a larger build for later. The hero/Why sections already reference Law 09-08 / CNDP.
- Phase 3 (lead magnet, city landing pages) is long-term and untouched.

---

### Phase 2: UX, Copywriting & Localization (Priority: Medium / 1–2 Weeks)

#### 4. Internationalization (i18n) Setup
- [ ] **Issue**: Site is exclusively in English. The primary decision-makers in Moroccan SMEs operate in French and Arabic.
- [ ] **Action**:
  - Set up i18n routing (e.g., `/fr/`, `/ar/`, `/en/`).
  - Prioritize French (`/fr/`) as the default secondary language.
  - Add a clean language switcher dropdown in the top navbar.

#### 5. Align Value Proposition with Moroccan Regulatory & Business Context
- [ ] **File Location**: Hero & "Why JectarOne" sections.
- [ ] **Action**:
  - Add explicit mention of compliance with Moroccan Law 09-08 (CNDP data privacy law).
  - Update hero tagline: *"Protecting Moroccan Enterprises against Cyber Threats, System Downtime, and Compliance Risks."*

#### 6. Contact Form Streamlining
- [ ] **File Location**: Contact section.
- [ ] **Action**:
  - Reduce form fields to essential inputs: `Full Name`, `Work Email`, `Phone / WhatsApp`, `Service Required`.
  - Add optional Calendly integration link on submission confirmation page for direct meeting booking.

---

### Phase 3: Lead Generation & SEO (Priority: Long-Term / 1 Month)

#### 7. Deploy a Lead Magnet (Free Security Tool/Checklist)
- [ ] **Action**:
  - Create a lightweight lead generation widget: *"Free External Domain Vulnerability Preview"*.
  - Alternatively, offer a downloadable PDF: *"Moroccan SMEs Cybersecurity Compliance Checklist"*.

#### 8. Local SEO Optimization
- [ ] **Action**:
  - Update meta titles and descriptions to include targeted local search terms (`Audit sécurité informatique Casablanca`, `Cybersecurity Morocco`).
  - Generate localized landing pages for key cities (Casablanca, Rabat).

---

## Execution Command Summary for Claude Code
Run through Phase 1 tasks first. Test components locally after removing demo text and adding the WhatsApp widget.
