// Source-invariant security tests (run with `node --test`).
// No PHP runtime is available in CI, so these lock in the security properties
// of the PHP/.htaccess/asset sources so a regression fails the build.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const exists = (p) => fs.existsSync(path.join(ROOT, p));

// ---------- C1: contact-form PII log lives outside the web root ----------
test("C1: contact log path is outside the web root", () => {
  const php = read("send-contact.php");
  assert.match(php, /JO_PRIVATE_DIR/, "expected a private-dir variable");
  assert.match(php, /dirname\(__DIR__\)\s*\.\s*'\/jo-private'/, "log dir must be above web root");
  assert.doesNotMatch(
    php,
    /\$LOG_FILE\s*=\s*__DIR__\s*\.\s*'\/contact-form\.log'/,
    "log must NOT be written into the web root"
  );
});

// ---------- M3: SMTP config loaded from outside the web root first ----------
test("M3: mail-config preferred from private dir with legacy fallback", () => {
  const php = read("send-contact.php");
  assert.match(php, /\$configPath\s*=\s*\$JO_PRIVATE_DIR\s*\.\s*'\/mail-config\.php'/);
  assert.match(php, /is_file\(\$configPath\)/, "must fall back only if private config absent");
});

// ---------- Contact form: existing protections preserved ----------
test("contact form retains honeypot, rate limit, header-injection guard, allowlist", () => {
  const php = read("send-contact.php");
  assert.match(php, /\$_POST\['website'\]/, "honeypot field");
  assert.match(php, /count\(\$hits\)\s*>=\s*\$limit/, "rate limiting");
  assert.match(php, /preg_replace\('\/\[\\r\\n\]\+\/'/, "CRLF mail-header-injection guard");
  assert.match(php, /FILTER_VALIDATE_EMAIL/, "email validation");
  assert.match(php, /\$allowedServices/, "service allowlist");
});

// ---------- SSRF guard invariants (tools/api) ----------
test("SSRF guard: private IPs blocked, IP pinned, no auto-redirect, port allowlist", () => {
  const g = read("tools/api/_guard.php");
  assert.match(g, /FILTER_FLAG_NO_PRIV_RANGE\s*\|\s*FILTER_FLAG_NO_RES_RANGE/, "reject private/reserved IPs");
  assert.match(g, /CURLOPT_RESOLVE/, "pin host to validated IP (anti-rebinding)");
  assert.match(g, /CURLOPT_FOLLOWLOCATION\s*=>\s*false/, "no automatic redirects");
  assert.match(g, /in_array\(\$port,\s*\[80,\s*443\]/, "port allowlist");
  assert.match(g, /in_array\(\$scheme,\s*\['http',\s*'https'\]/, "scheme allowlist");
});

// ---------- H1/H3: .htaccess denies sensitive files & disables indexing ----------
test("H1/H3: .htaccess denies sensitive files and disables indexing", () => {
  const h = read(".htaccess");
  assert.match(h, /IndexIgnore\s+\*/, "IndexIgnore *");
  assert.match(h, /Options\s+-Indexes/, "Options -Indexes");
  assert.match(h, /FilesMatch[^>]*log\|md/, "deny .log/.md etc.");
  assert.match(h, /Require all denied/, "deny directive present");
  // security headers still configured
  for (const hdr of [
    "Strict-Transport-Security",
    "Content-Security-Policy",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
  ]) {
    assert.match(h, new RegExp(hdr), `${hdr} header configured`);
  }
});

// ---------- H2: directory-listing guards present ----------
test("H2: blank index.html guards exist in listable dirs", () => {
  for (const d of ["css", "js", "assets", "vendor", "vendor/phpmailer", "tools/api", "app/vendor"]) {
    assert.ok(exists(path.join(d, "index.html")), `${d}/index.html should exist`);
  }
});

// ---------- M4: favicon is small ----------
test("M4: favicon-32x32.png is small (< 10KB)", () => {
  const size = fs.statSync(path.join(ROOT, "favicon-32x32.png")).size;
  assert.ok(size < 10 * 1024, `favicon should be <10KB, is ${size}`);
});

// ---------- Secrets not committed ----------
test("no real SMTP credentials are tracked in git", () => {
  const tracked = execSync("git ls-files", { cwd: ROOT, encoding: "utf8" });
  assert.doesNotMatch(tracked, /(^|\n)mail-config\.php(\n|$)/, "mail-config.php must be gitignored");
  assert.doesNotMatch(tracked, /(^|\n)contact-form\.log(\n|$)/, "no committed contact log");
});
