# JectarOne

> Moroccan cybersecurity consultancy helping small and medium-sized businesses understand and improve their security posture.

This repository contains the source for the **jectar.one** website and the foundational company documents for JectarOne.

- **Live site:** https://jectar.one
- **Contact:** contact@jectar.one · +212 752-138075
- **Location:** Casablanca, Morocco

---

## What JectarOne does

JectarOne is an independent, vendor-neutral cybersecurity consultancy. We provide:

- Security Assessment
- Vulnerability Assessment
- Penetration Testing
- Web Application Security Review
- Security Awareness Training
- Compliance Readiness (ISO 27001)

Target market: Moroccan SMEs, startups, healthcare, law firms, financial services, manufacturing, and e-commerce.

See [docs/SERVICE-CATALOG.md](docs/SERVICE-CATALOG.md) for the full service descriptions and [docs/COMPANY-PROFILE.md](docs/COMPANY-PROFILE.md) for the company overview.

---

## Tech stack

The website is a **static site** — no build step required.

- HTML5, CSS3 (single stylesheet, design tokens in `:root`)
- Vanilla JavaScript (no framework)
- [Lucide](https://lucide.dev) icons via CDN
- Google Fonts: Space Grotesk + Inter
- Hosted on standard Apache hosting (`.htaccess` handles HTTPS, gzip, caching)

> A `Next.js / React` rewrite is intentionally **not** used: a static site already meets the project's goals (responsive, accessible, SEO, fast, dark-mode) and deploys on the current hosting without breaking the blog or `.htaccess` configuration.

---

## Repository structure

```
.
├── index.html                  # Home
├── about.html                  # About
├── services.html               # Services (Request a Quote)
├── case-studies.html           # Case studies (demo content)
├── privacy.html                # Privacy Policy (Morocco Law 09-08)
├── terms.html                  # Terms of Service
├── 404.html                    # Not-found page
├── blog/                       # Blog hub + cybersecurity articles
├── css/style.css               # Main stylesheet (design tokens + components)
├── js/main.js                  # Nav, scroll progress, reveal, FAQ
├── .well-known/security.txt    # Responsible disclosure (RFC 9116)
├── sitemap.xml, robots.txt, .htaccess
├── docs/                       # Company & strategy documentation
├── README.md, SECURITY.md, LICENSE
```

---

## Running locally

Any static file server works. For example:

```bash
npx serve -l 4321 .
# then open http://localhost:4321
```

---

## Brand

Colors, typography, voice, and logo usage are documented in [docs/BRAND-GUIDELINES.md](docs/BRAND-GUIDELINES.md).

| Token | Value | Use |
|------|-------|-----|
| Background | `#08111F` | Page background |
| Primary | `#2563EB` | Buttons, links |
| Accent | `#38BDF8` | Highlights, icons |
| Text | `#F8FAFC` | Body text |
| Muted | `#94A3B8` | Secondary text |

---

## Security

Found a vulnerability in our website or systems? Please follow our responsible disclosure policy in [SECURITY.md](SECURITY.md). As a cybersecurity company, we take reports seriously and will respond promptly.

---

## Documentation index

| Document | Purpose |
|----------|---------|
| [docs/COMPANY-PROFILE.md](docs/COMPANY-PROFILE.md) | Who we are, mission, values |
| [docs/SERVICE-CATALOG.md](docs/SERVICE-CATALOG.md) | Detailed service descriptions & deliverables |
| [docs/ENGAGEMENT-PROCESS.md](docs/ENGAGEMENT-PROCESS.md) | How we run engagements (rules of engagement) |
| [docs/STRATEGIC-ROADMAP.md](docs/STRATEGIC-ROADMAP.md) | Vision, business model, product & GTM roadmap |
| [docs/CONTENT-STRATEGY.md](docs/CONTENT-STRATEGY.md) | Blog & content plan |
| [docs/BRAND-GUIDELINES.md](docs/BRAND-GUIDELINES.md) | Visual identity & voice |
| [docs/IDENTITY-SETUP.md](docs/IDENTITY-SETUP.md) | Logo assets, LinkedIn & Google Business setup, email signature |

---

© 2026 JectarOne. All rights reserved. See [LICENSE](LICENSE).
