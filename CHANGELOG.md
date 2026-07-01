# Changelog

All notable changes to the JectarOne website. Dates reflect commit history on `main`.

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
