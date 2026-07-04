# Changelog

All notable changes to the JectarOne website. Dates reflect commit history on `main`.

## 2026-07-04 — Security hardening (branch `security-hardening`)

Audit remediation. Every Critical/High/Medium item in this repo fixed, each as
its own commit, with automated tests (`npm test`: 8 security invariants + 22
Playwright/axe UI+a11y checks — all green). Design language unchanged.

### Critical
- **fix(contact) `C1`:** contact-form log (email, name, IP of every submitter)
  was written to `contact-form.log` in the web root and was **publicly
  downloadable**. Now written to `jo-private/` one level above `public_html`
  (`JO_PRIVATE_DIR`, `0700`), never web-servable. `send-contact.php`.
  **Operational follow-up required:** delete the currently-live
  `contact-form.log` from the server and rotate the SMTP mailbox password.

### High
- **fix(htaccess) `H1`/`H3`:** added `FilesMatch` deny rules for source/config/log
  extensions (`.md .log .sql .bak .env .ini .yml`, `package.json`, `.cpanel.yml`,
  …) plus `IndexIgnore *`. Note: effectiveness depends on the host honoring
  `.htaccess` — the audit found these directives were **not being applied in
  production**. **Hosting action:** confirm `AllowOverride All` (or move the
  header/deny rules into the LiteSpeed vhost) and verify
  `curl -I https://jectar.one/CHANGELOG.md` returns `403` and
  `curl -I https://jectar.one/` returns the six security headers.
- **fix(listing) `H2`:** directory listing was live (`Options -Indexes` ignored),
  exposing `css/ js/ assets/ vendor/` source trees. Added blank `noindex`
  `index.html` guards to every listable directory — these stop autoindex
  **regardless** of `AllowOverride`. `.php` endpoints are unaffected.
- **chore(deploy) `H3`:** `.cpanel.yml` rsync now also excludes `node_modules`,
  `tests`, Playwright artifacts, package manifests, `mail-config.php`, `*.log`
  and `New folder`, so tooling and secrets never reach `public_html`.

### Medium
- **fix(contact) `M3`:** `mail-config.php` (SMTP password) loaded from
  `jo-private/` first, falling back to the legacy in-root path so existing
  installs keep sending mail until migrated. `send-contact.php`,
  `mail-config.example.php`.
- **perf(favicon) `M4`:** `favicon-32x32.png` reduced from **344 KB → 1.2 KB**
  (re-rasterized from `favicon.svg`); added dedicated 180×180
  `apple-touch-icon.png` (5.3 KB) referenced by root pages. Regenerate with
  `npm run build:favicon`. Same shield mark — design unchanged.
- **`M1`/`M2` (portal, separate repo):** missing security headers / clickjacking
  on `/login` and wildcard CORS. Ready-to-apply `next.config.js` and CORS
  guidance captured in `docs/PORTAL-SECURITY-FIXES.md` (must be applied in the
  `jectarone-portal` repo — not fixable from this repo).

### Tests added
- `tests/security.test.mjs` — `node:test` source-invariant suite (no PHP runtime
  in CI): asserts log/config are out of web root, contact-form protections
  intact, SSRF-guard invariants (private-IP block, IP pinning, no auto-redirect,
  port/scheme allowlist), `.htaccess` deny+index rules, listing guards, favicon
  size, and that no secrets are git-tracked.
- `tests/ui.spec.js` — Playwright (desktop + mobile): page load, no console
  errors, header render, skip link, image alt, favicon size, mobile menu toggle.
- `tests/a11y.spec.js` — `@axe-core/playwright` (WCAG 2.0/2.1 A/AA) gating on
  serious/critical violations across home, product, services, about, tools.
  Result: **0 serious/critical violations.**
- `tests/server.js` dependency-free static server; `scripts/build-favicon.js`.

### Not changed (verified already correct)
- SSRF guard (`tools/api/_guard.php`) — confirmed effective live (localhost
  rejected, public target OK). Kept as-is.
- `send-contact.php` input validation (honeypot, rate limit, CRLF guard, service
  allowlist, `FILTER_VALIDATE_EMAIL`) — preserved.
- `app/report-builder.js` — no DOM XSS; unchanged.

## 2026-07-01
- **fix:** switch contact form to authenticated SMTP via self-hosted PHPMailer (`b8558b3`); raw `mail()` wasn't delivering. Credentials in gitignored `mail-config.php`; every attempt logged to `contact-form.log`.
- **content:** 6 new pillar articles — Zero Trust, Cloud Security, Windows Hardening, Active Directory, Vulnerability Management, Moroccan Regulations (`f7625ec`). Blog now 14 articles.
- **feat:** wire contact form to a real email handler `send-contact.php` — honeypot + rate limit + validation (`4e77447`).
- **feat:** interactive product demo (`/product-demo.html`, labeled sample data) + documentation portal stub (`/docs/`) (`0597aac`).
- **feat:** honest Product page + input-field autofill fix + PDF polish (`9075b35`).
- **docs:** Phase 2 analysis for the SaaS Execution Guide (`docs/blueprint/ANALYSIS.md`); added PROJECT_MEMORY / ROADMAP / CHANGELOG.

## 2026-06-30
- **feat:** internal client-side Assessment Report Builder at `/app/` → branded PDF via self-hosted jsPDF (`be235d0`).
- **content:** 4 articles — M365, phishing, network hardening, incident response (`14f3f0b`).
- **security:** HTTP security headers (HSTS, CSP, etc.) in `.htaccess` (`767656a`).
- **feat:** free security tools hub + 5 tools; the 3 network tools use SSRF-hardened PHP endpoints (`a97bf90`).
- **fix:** cache-bust css/js (`?v=`) to defeat stale immutable caching (`4e9fc30`).
- **feat:** relaunch as an honest Moroccan cybersecurity consultancy — new design system, pages, blog rebuild; removed legacy agency content + fake SaaS elements (`81a615d`). Added SVG logo set, PNG exports, Company Profile PDF, `security.txt`, company docs.

## Earlier (pre-relaunch)
- SEO infrastructure (schema, sitemap, robots, 404), Lighthouse/perf work, blog system, `.htaccess`, responsive/contrast fixes. See git history before `81a615d`.
