# JectarOne — Identity Setup (Phase 2)

Status of the Phase 2 "professional identity" checklist and ready-to-use content. Items marked **[you]** require you to create an account/profile externally; everything you need to paste is below.

| Item | Status |
|------|--------|
| Professional email (`contact@jectar.one`) | ✅ Done, used site-wide |
| SVG logo | ✅ Done — see `assets/` |
| Company Profile (PDF) | ✅ Done — `assets/JectarOne-Company-Profile.pdf` |
| LinkedIn Company Page | **[you]** — content below |
| Google Business Profile | **[you]** — content below |

---

## Logo assets (in `assets/` and root)

| File | Use |
|------|-----|
| `assets/logo.svg` | Full horizontal lockup (mark + wordmark) for dark backgrounds — site header, email signature |
| `assets/logo-light.svg` | Same lockup for **light/white** backgrounds — letterhead, documents |
| `assets/logo-mark.svg` | Shield mark only (transparent) |
| `assets/logo-avatar.svg` | **Square 1:1** mark on dark tile — use for LinkedIn / Google / social profile picture |
| `favicon.svg` | Browser tab icon (already wired into all pages) |

> To get a PNG (some platforms need PNG, e.g. LinkedIn logo upload prefers 300×300 PNG): open the SVG in a browser or design tool and export, or run any SVG→PNG converter. `logo-avatar.svg` exports cleanly at 400×400.

---

## LinkedIn Company Page **[you]**

Create at: https://www.linkedin.com/company/setup/new/

- **Name:** JectarOne
- **Public URL:** linkedin.com/company/**jectarone** (already referenced in the site footer)
- **Logo:** export `assets/logo-avatar.svg` to 300×300 PNG
- **Tagline (120 char max):**
  > Cybersecurity services for Moroccan businesses — assessments, pentesting, and practical guidance.
- **Industry:** Computer & Network Security
- **Company size:** 1–10 · **Type:** Privately held · **HQ:** Casablanca, Morocco

**About (paste):**
> JectarOne is an independent cybersecurity consultancy based in Casablanca, Morocco. We help small and medium-sized businesses understand their real security risks and fix the ones that matter — clearly, practically, and without unnecessary spend.
>
> Our services: Security Assessments, Vulnerability Assessments, Penetration Testing, Web Application Security Reviews, Security Awareness Training, and ISO 27001 Readiness.
>
> We are vendor-neutral and business-focused: clear reporting for leadership, technical detail for IT teams, and confidential, NDA-backed engagements — remote or on-site across Morocco.
>
> 📧 contact@jectar.one · 📞 +212 752-138075 · 🌐 jectar.one

---

## Google Business Profile **[you]**

Create at: https://business.google.com

- **Business name:** JectarOne
- **Primary category:** Computer security service
- **Secondary categories:** Software company; Business management consultant
- **Service area:** Morocco (set as a service-area business if you don't take walk-ins)
- **Phone:** +212 752-138075 · **Website:** https://jectar.one
- **Logo:** `assets/logo-avatar.svg` → PNG

**Description (paste, ≤750 char):**
> JectarOne is a Moroccan cybersecurity consultancy helping small and medium-sized businesses improve their security posture. We provide security assessments, vulnerability assessments, penetration testing, web application security reviews, security awareness training, and ISO 27001 readiness. Vendor-neutral, business-focused, and confidential — delivered remotely or on-site across Morocco. Contact us for a security assessment or a consultation.

**Services to add:** Security Assessment · Vulnerability Assessment · Penetration Testing · Web Application Security · Security Awareness Training · ISO 27001 Readiness

> Tip: keep the name/address/phone (NAP) identical to the website and LinkedIn for local SEO consistency.

---

## Email signature (HTML)

```html
<table style="font-family:Inter,Arial,sans-serif;color:#0F172A;font-size:13px;">
  <tr>
    <td style="padding-right:14px;">
      <img src="https://jectar.one/assets/logo-avatar.svg" width="52" height="52" alt="JectarOne">
    </td>
    <td>
      <strong style="font-size:15px;">JectarOne</strong><br>
      <span style="color:#64748B;">Cybersecurity Consulting · Casablanca, Morocco</span><br>
      <a href="mailto:contact@jectar.one" style="color:#2563EB;">contact@jectar.one</a> ·
      <a href="tel:+212752138075" style="color:#2563EB;">+212 752-138075</a> ·
      <a href="https://jectar.one" style="color:#2563EB;">jectar.one</a>
    </td>
  </tr>
</table>
```

---
© 2026 JectarOne. Confidential company document.
