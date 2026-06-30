# JectarOne — Brand Guidelines

## Brand personality

Professional. Quiet confidence. Trustworthy. The kind of company a bank or hospital would comfortably hire.

**Avoid:** hacker clichés, glowing skulls, "Matrix" green, fake live attack maps, exaggerated marketing, and invented statistics.

## Voice & tone

- Clear, calm, and direct. Short sentences.
- Speak to business owners and IT managers — not security researchers.
- Explain risk without fear-mongering. No unnecessary jargon.
- Honest: if something is a demo or a placeholder, say so.

## Logo

- Wordmark: **JectarOne** (one word, capital J and O).
- Tagline / sub-label: **Cybersecurity Consulting**.
- Mark: a shield-check glyph in the brand accent, on a subtle gradient tile.
- A dedicated **SVG logo** is a Phase 2 deliverable.

### Usage
- Maintain clear space around the logo equal to the height of the "J".
- Do not stretch, recolor outside the palette, or add effects (glow, bevel).

## Color palette

| Token | Hex | Use |
|-------|-----|-----|
| Background | `#08111F` | Page background |
| Background (deep) | `#060D18` | Inputs, deep panels |
| Surface | `#0F172A` | Cards, panels |
| Primary | `#2563EB` | Buttons, primary actions |
| Primary (strong) | `#1D4ED8` | Hover / pressed |
| Accent | `#38BDF8` | Icons, links, highlights |
| Success | `#22C55E` | Positive states |
| Warning | `#F59E0B` | Demo tags, caution |
| Danger | `#EF4444` | Critical severity |
| Text | `#F8FAFC` | Body text |
| Muted | `#94A3B8` | Secondary text |

These are defined as CSS custom properties in `css/style.css` (`:root`).

## Typography

- **Display / headings:** Space Grotesk (500–700).
- **Body / UI:** Inter (400–800).
- Headings use slightly tight letter-spacing; body line-height ~1.65.

## UI style

- **Restrained and modern.** Rounded corners (12–22px), soft shadows, minimal gradients.
- **Subtle motion only** — gentle reveal-on-scroll. No distracting animation.
- Generous spacing; avoid visual noise.
- Respect `prefers-reduced-motion`.

## Imagery

- Professional photography (real operations / workspaces) mixed with clean technical illustrations and line icons (Lucide).
- No futuristic holograms or stock "hacker in a hoodie" imagery.

## Accessibility

- Maintain readable contrast against `#08111F`.
- Provide focus states, alt text, semantic HTML, and skip links.
- Icons that convey meaning need accessible labels; decorative icons use `aria-hidden`.

## Contact block (canonical)

> **JectarOne** — Cybersecurity Consulting
> Casablanca, Morocco
> contact@jectar.one · +212 752-138075
> https://jectar.one

---
© 2026 JectarOne. Confidential company document.
