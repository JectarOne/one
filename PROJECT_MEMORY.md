# PROJECT_MEMORY

Living context for the JectarOne project. Updated every work session (per the Execution Guide).

## What this project is (today)
An **honest Moroccan cybersecurity consultancy website** (static HTML/CSS/JS) at `jectar.one`, deployed on cPanel shared hosting from the `JectarOne/one` repo via `git pull`. Positioning approved by the owner: **keep the consultancy; add product surfaces that are clearly labeled** (no imaginary/functional SaaS presented as real).

## Completed work
- Marketing site: home, about, services, case-studies (demo-labeled), privacy (Law 09-08), terms, 404 — all on one design system (`css/style.css`, tokens in `:root`).
- Blog: **14** cybersecurity articles + hub, each with BlogPosting JSON-LD.
- Free tools: **5** — Password Generator, Password Strength Checker (static); Security Headers, SSL, Website Scanner (PHP, SSRF-hardened in `tools/api/`).
- Real feature: client-side **Assessment Report Builder** (`/app/`) → branded PDF (self-hosted jsPDF).
- Labeled mock: **interactive product demo** (`/product-demo.html`), Product page, docs portal stub (`/docs/*.html`).
- Contact form → `send-contact.php` (authenticated SMTP via PHPMailer; honeypot; rate limit; logging).
- Brand: SVG logo set, PNG exports, `og-image.png`, Company Profile PDF, `.well-known/security.txt`.
- Security: HSTS/CSP/etc. headers in `.htaccess`; cache-busting `?v=` on css/js.
- Company docs in `docs/` (profile, service catalog, engagement process, strategy, content, brand, identity setup).

## Architecture decisions (standing)
- **Static site on cPanel**, deliberately (meets responsive/SEO/perf/dark-mode; deploys on current hosting). No Node build step.
- PHP endpoints for anything needing a server (tools, contact); secrets gitignored (`mail-config.php`).
- Third-party libs **self-hosted** (jsPDF, PHPMailer) to keep CSP clean and avoid CDN reliance.
- Product surfaces are **mock + clearly labeled**, not functional SaaS (owner-approved).

## Known issues / pending (owner action)
- **Contact email delivery:** owner must create real `mail-config.php` on the server with cPanel SMTP creds, then retest; check `contact-form.log` if it still fails.
- LinkedIn Company Page + Google Business Profile: content ready in `docs/IDENTITY-SETUP.md`, owner must create them.

## Open questions (blocking the SaaS Execution Guide)
See `docs/blueprint/ANALYSIS.md` §7. Summary:
1. **Is "the product" a Client Portal (realistic) or a real EDR/XDR (team-years)?**
2. **Where does the app run** — new app hosting (Vercel/VPS + DB) or must it fit cPanel (PHP+MySQL only)?
3. The guide's `docs/blueprint/` source-of-truth files **do not exist** — provide them, or approve using existing roadmap docs as the spec.

## Technical debt
- LF→CRLF git warnings (benign, Windows).
- `js/particles.js` unreferenced/dead.
- Docs portal (`/docs/`) is a stub; API/dev docs intentionally not written (no real API yet).

## Next task
Await owner decision on ANALYSIS §7 (product scope + hosting). Then: Phase 3 architecture for approval → Sprint 1 vertical build. Until then, safe incremental work only (content, tools, honest site improvements).
