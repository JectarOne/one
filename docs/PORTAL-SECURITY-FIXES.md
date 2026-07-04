# Portal (portal.jectar.one) — security fixes

> These belong to the **separate `jectarone-portal` repo** (Next.js on Vercel),
> not this static-site repo. Captured here so the audit items are not lost.
> Apply in that repo, then re-run this section's verification.

## M1 (Medium-High) — Missing security headers / clickjacking on `/login`

Live check showed no CSP, `X-Frame-Options`, `X-Content-Type-Options`, or
`Referrer-Policy` on the portal (only HSTS). The login page can be framed.

**Fix — `next.config.js`:**

```js
/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), camera=(), microphone=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "img-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self'",
      "connect-src 'self'",
    ].join("; "),
  },
];

module.exports = {
  poweredByHeader: false, // L1: stop leaking X-Powered-By: Next.js
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
```

**Verify:**
```bash
curl -sSI https://portal.jectar.one/login | grep -iE 'content-security|frame|nosniff|referrer|powered'
# expect CSP + X-Frame-Options: DENY + nosniff, and NO X-Powered-By
```

## M2 (Medium) — `Access-Control-Allow-Origin: *`

The login response returns `ACAO: *`. Harmless on a static page, dangerous on
any `/api/*` route that returns user data or sets `Access-Control-Allow-Credentials`.

**Action:**
- Audit every API route. Never combine `ACAO: *` with credentials.
- Pin allowed origin to `https://portal.jectar.one` (and known first-party origins only).
- Prefer same-origin API calls so CORS is not needed at all.

## Untestable without source/credentials (do these in the portal repo)

The following audit items could not be tested externally and must be reviewed in
the portal codebase with test credentials:

- AuthZ / IDOR on tenant/user-scoped resources (every object read must check ownership).
- JWT/session validation (signature alg pinned, expiry enforced, no `alg:none`).
- Session fixation, cookie flags (`Secure`, `HttpOnly`, `SameSite`).
- Password reset & email-verification token entropy/expiry/single-use.
- Rate limiting / brute-force protection on login and reset.
- Server-side validation on every mutating endpoint.
