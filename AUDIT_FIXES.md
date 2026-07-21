# Claude Code Action Plan: jectar.one Audit Fixes

**Target URL:** https://jectar.one/  
**Objective:** Fix mobile responsiveness, accessibility (a11y), and SEO issues identified in the site audit.  
**Date:** July 22, 2026  

Please execute the following tasks in order. Update the checkboxes `- [ ]` to `- [x]` as each task is completed.

---

## 📁 File: `index.html` (or main HTML entry file)

### 1. Fix Missing Image Alt Attributes (Accessibility - High Priority)
- [x] Locate all `<img>` tags, specifically the logo (`assets/logo-mark.svg`).
- [x] Add descriptive `alt` attributes. If the logo is purely decorative and accompanied by text, use an empty alt. Otherwise, describe it.
  > **Done — already compliant.** Sitewide scan: **0 `<img>` missing `alt`**. Every logo mark is `<span class="brand-mark" aria-hidden="true"><img … alt="" width="24" height="24"></span>` — decorative + text beside it, so an empty `alt` is the correct WCAG choice (a descriptive "JectarOne Logo" here would be redundant noise for screen readers). The hero image already has a descriptive `alt`.
  ```html
  <!-- BEFORE -->
  <img src="assets/logo-mark.svg" class="logo">
  
  <!-- AFTER -->
  <img src="assets/logo-mark.svg" alt="JectarOne Logo" class="logo" width="32" height="32">
  
    <!-- BEFORE -->
  <meta name="theme-color" content="#0A0E1A">
  
  <!-- AFTER -->
  <meta name="theme-color" content="#0A0E1A" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <!-- TODO: Verify that /assets/og-image.png is exactly 1200x630px (1.91:1 ratio) for optimal social media sharing -->
  <meta property="og:image" content="https://jectar.one/assets/og-image.png">
  
    /* BEFORE */
  .icon-button {
    width: 22px;
    height: 22px;
  }

  /* AFTER */
  .icon-button {
    width: 22px;
    height: 22px;
    /* Add touch target expansion */
    min-width: 48px;
    min-height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 13px; /* (48 - 22) / 2 = 13px padding to center the 22px icon */
  }
  
  
    /* BEFORE */
  body {
    overflow-x: hidden;
  }

  /* AFTER (Preferred) */
  .main-wrapper {
    overflow-x: hidden;
    width: 100%;
    position: relative;
  }
  
    /* BEFORE */
  .nav-link:hover {
    color: #3b82f6;
  }

  /* AFTER */
  .nav-link:hover,
  .nav-link:focus {
    color: #3b82f6;
  }

  @media (hover: hover) {
    .nav-link:hover {
      color: #3b82f6;
    }
  }

---

## ✅ Completion log (applied 2026-07-22)

- [x] **Image alt attributes** — already compliant sitewide (0 missing; decorative logos use empty `alt`). See note above.
- [x] **Touch targets → 44px** (`css/style.css`) — bumped `.menu-toggle` (42→44), `.lang-toggle` (34→44), `.share-btn` (38→44), `.social-links a` (38→44). Used **44px** (WCAG 2.5.5 AAA / Apple HIG 44pt) rather than the sample's 48px so the compact header stays balanced; 44px still clears the WCAG 2.5.8 AA minimum comfortably. No literal `.icon-button` class exists — these are the site's actual icon controls.
- [x] **Horizontal-scroll containment** (`css/style.css`) — changed `body { overflow-x: hidden }` → **`overflow-x: clip`**. Modern equivalent that blocks horizontal scroll *without* creating a scroll container (so it can't break `position: sticky`/anchor scrolling). Chosen over the `.main-wrapper` refactor because it needs no structural HTML change across 35 pages. Header is `position: fixed`, so it was never at risk anyway.
- [x] **`apple-touch-icon` sizes** — added `sizes="180x180"` on all 8 pages that reference it; the PNG is verified 180×180.
- [x] **OG image ratio** — `assets/og-image.png` verified **1200×630** (1.91:1). No change needed.
- [x] **Nav-link focus states** — already present: `.nav-links a:hover, .nav-links a:focus-visible` (keyboard focus covered). No change required.
- [ ] **theme-color light/dark split — intentionally NOT applied.** The site is a single **dark** theme (obsidian `#0A0E1A`) with no light mode. Adding `content="#ffffff" media="(prefers-color-scheme: light)"` would paint the mobile browser chrome white above an always-dark page — a visual mismatch. Kept the single dark `theme-color`, which is the correct value for this design. Revisit if a light theme is ever added.

Cache-busting bumped to `style.css?v=20260723` sitewide so returning visitors get the updated CSS.