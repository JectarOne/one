<?php
// JectarOne free tools — shared backend guard.
// Security-critical: these endpoints fetch user-supplied targets server-side,
// so we defend against SSRF (private/reserved IPs, non-HTTP schemes, odd ports,
// DNS rebinding) and apply basic rate limiting.

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

const JO_UA = 'JectarOne-Tools/1.0 (+https://jectar.one/tools/)';
const JO_TIMEOUT = 8;
const JO_MAX_BYTES = 262144; // 256 KB body cap
const JO_MAX_REDIRECTS = 3;

function jo_send(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function jo_fail(string $msg, int $code = 400): void {
    jo_send(['ok' => false, 'error' => $msg], $code);
}

function jo_client_ip(): string {
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

// Simple file-based rate limit: max $limit requests per $window seconds per IP.
function jo_rate_limit(int $limit = 15, int $window = 60): void {
    $dir = sys_get_temp_dir() . '/jo_tools_rl';
    @mkdir($dir, 0700, true);
    $key = $dir . '/' . hash('sha256', jo_client_ip());
    $now = time();
    $hits = [];
    if (is_file($key)) {
        $raw = @file_get_contents($key);
        $hits = $raw ? array_filter(array_map('intval', explode(',', $raw)), fn($t) => $t > $now - $window) : [];
    }
    if (count($hits) >= $limit) {
        jo_fail('Rate limit exceeded. Please wait a minute and try again.', 429);
    }
    $hits[] = $now;
    @file_put_contents($key, implode(',', $hits), LOCK_EX);
}

// True only for genuinely public, routable IPs.
function jo_ip_is_public(string $ip): bool {
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
        // Extra explicit blocks (CGNAT 100.64/10, 0.0.0.0)
        $long = ip2long($ip);
        if ($long !== false) {
            if (($long & 0xFFC00000) === (ip2long('100.64.0.0') & 0xFFC00000)) return false;
            if ($ip === '0.0.0.0') return false;
        }
        return true;
    }
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
        $lc = strtolower($ip);
        if ($lc === '::' || $lc === '::1') return false;
        if (strpos($lc, '::ffff:') === 0) return false; // IPv4-mapped
        return true;
    }
    return false;
}

// Resolve host to IPs and require ALL of them to be public (anti-rebinding).
function jo_resolve_public(string $host): array {
    $ips = [];
    $v4 = @gethostbynamel($host);
    if (is_array($v4)) $ips = array_merge($ips, $v4);
    $aaaa = @dns_get_record($host, DNS_AAAA);
    if (is_array($aaaa)) foreach ($aaaa as $r) if (!empty($r['ipv6'])) $ips[] = $r['ipv6'];
    $ips = array_values(array_unique($ips));
    if (!$ips) jo_fail('Could not resolve that hostname.', 400);
    foreach ($ips as $ip) {
        if (!jo_ip_is_public($ip)) {
            jo_fail('Target resolves to a private or reserved address and cannot be scanned.', 400);
        }
    }
    return $ips;
}

// Parse + validate a user-supplied target. Returns [scheme, host, port, url, ip].
function jo_parse_target(string $raw): array {
    $raw = trim($raw);
    if ($raw === '' || strlen($raw) > 2048) jo_fail('Please enter a valid website address.');
    if (!preg_match('~^https?://~i', $raw)) $raw = 'https://' . $raw;

    $p = parse_url($raw);
    if ($p === false || empty($p['host'])) jo_fail('That does not look like a valid URL.');
    if (isset($p['user']) || isset($p['pass'])) jo_fail('Credentials in the URL are not allowed.');

    $scheme = strtolower($p['scheme'] ?? 'https');
    if (!in_array($scheme, ['http', 'https'], true)) jo_fail('Only http and https are supported.');

    $host = strtolower($p['host']);
    // reject raw private literals early
    if (filter_var($host, FILTER_VALIDATE_IP) && !jo_ip_is_public($host)) {
        jo_fail('Private or reserved addresses cannot be scanned.');
    }
    $port = isset($p['port']) ? (int)$p['port'] : ($scheme === 'https' ? 443 : 80);
    if (!in_array($port, [80, 443], true)) jo_fail('Only ports 80 and 443 are supported.');

    $ips = jo_resolve_public($host);
    $path = $p['path'] ?? '/';
    $url = $scheme . '://' . $host . ($port !== ($scheme === 'https' ? 443 : 80) ? ':' . $port : '') . $path
         . (isset($p['query']) ? '?' . $p['query'] : '');

    return ['scheme' => $scheme, 'host' => $host, 'port' => $port, 'url' => $url, 'ips' => $ips];
}

// Safe single fetch with the host pinned to a validated IP (no auto-redirect).
function jo_fetch_once(string $url, string $host, int $port, string $ip): array {
    $ch = curl_init();
    $pin = $host . ':' . $port . ':' . $ip;
    $headerLines = [];
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_TIMEOUT => JO_TIMEOUT,
        CURLOPT_CONNECTTIMEOUT => JO_TIMEOUT,
        CURLOPT_USERAGENT => JO_UA,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
        CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTP | CURLPROTO_HTTPS,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_RESOLVE => [$pin],
        CURLOPT_ACCEPT_ENCODING => '',
        CURLOPT_HEADERFUNCTION => function ($c, $line) use (&$headerLines) {
            $headerLines[] = $line;
            return strlen($line);
        },
        CURLOPT_WRITEFUNCTION => function ($c, $chunk) {
            static $total = 0;
            $total += strlen($chunk);
            if ($total > JO_MAX_BYTES) return 0; // abort large bodies
            $GLOBALS['jo_body'] = ($GLOBALS['jo_body'] ?? '') . $chunk;
            return strlen($chunk);
        },
    ]);
    $GLOBALS['jo_body'] = '';
    curl_exec($ch);
    $errno = curl_errno($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    $body = $GLOBALS['jo_body'] ?? '';
    $GLOBALS['jo_body'] = '';

    if ($errno && $errno !== CURLE_WRITE_ERROR && $status === 0) {
        jo_fail('Could not connect to that site (it may be down or blocking requests).', 502);
    }
    return ['status' => $status, 'headerLines' => $headerLines, 'body' => $body];
}

// Fetch following up to N redirects, re-validating each hop (SSRF-safe).
function jo_fetch(string $startUrl): array {
    $target = jo_parse_target($startUrl);
    $url = $target['url'];
    $host = $target['host']; $port = $target['port']; $ip = $target['ips'][0];
    $hops = [];
    for ($i = 0; $i <= JO_MAX_REDIRECTS; $i++) {
        $res = jo_fetch_once($url, $host, $port, $ip);
        $parsed = jo_parse_header_lines($res['headerLines']);
        $hops[] = ['url' => $url, 'status' => $res['status']];
        if ($res['status'] >= 300 && $res['status'] < 400 && !empty($parsed['assoc']['location']) && $i < JO_MAX_REDIRECTS) {
            $loc = $parsed['assoc']['location'];
            // resolve relative redirect
            if (!preg_match('~^https?://~i', $loc)) {
                $loc = $target['scheme'] . '://' . $host . '/' . ltrim($loc, '/');
            }
            $target = jo_parse_target($loc); // re-validate (blocks internal redirects)
            $url = $target['url']; $host = $target['host']; $port = $target['port']; $ip = $target['ips'][0];
            continue;
        }
        return [
            'finalUrl' => $url, 'status' => $res['status'],
            'headers' => $parsed['assoc'], 'setCookies' => $parsed['cookies'],
            'body' => $res['body'], 'hops' => $hops, 'scheme' => $target['scheme'], 'host' => $host,
        ];
    }
    return ['finalUrl' => $url, 'status' => 0, 'headers' => [], 'setCookies' => [], 'body' => '', 'hops' => $hops, 'scheme' => $target['scheme'], 'host' => $host];
}

function jo_parse_header_lines(array $lines): array {
    $assoc = []; $cookies = [];
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || stripos($line, 'HTTP/') === 0) continue;
        $pos = strpos($line, ':');
        if ($pos === false) continue;
        $name = strtolower(trim(substr($line, 0, $pos)));
        $val = trim(substr($line, $pos + 1));
        if ($name === 'set-cookie') { $cookies[] = $val; continue; }
        $assoc[$name] = isset($assoc[$name]) ? $assoc[$name] . ', ' . $val : $val;
    }
    return ['assoc' => $assoc, 'cookies' => $cookies];
}

// Analyze security headers -> checks + letter grade. Shared by headers + scanner.
function jo_analyze_headers(array $h): array {
    $defs = [
        ['strict-transport-security', 'HSTS (Strict-Transport-Security)', 'Forces browsers to use HTTPS.', 'high'],
        ['content-security-policy', 'Content-Security-Policy', 'Mitigates XSS and data injection.', 'high'],
        ['x-content-type-options', 'X-Content-Type-Options', 'Stops MIME-type sniffing (should be "nosniff").', 'medium'],
        ['x-frame-options', 'X-Frame-Options / frame-ancestors', 'Prevents clickjacking.', 'medium'],
        ['referrer-policy', 'Referrer-Policy', 'Controls how much referrer info is shared.', 'low'],
        ['permissions-policy', 'Permissions-Policy', 'Restricts powerful browser features.', 'low'],
    ];
    $checks = []; $score = 0; $max = 0;
    $weights = ['high' => 3, 'medium' => 2, 'low' => 1];
    foreach ($defs as [$key, $name, $desc, $sev]) {
        $present = isset($h[$key]);
        // X-Frame-Options can be satisfied by CSP frame-ancestors
        if ($key === 'x-frame-options' && !$present && isset($h['content-security-policy'])
            && stripos($h['content-security-policy'], 'frame-ancestors') !== false) {
            $present = true;
        }
        $max += $weights[$sev];
        if ($present) $score += $weights[$sev];
        $checks[] = [
            'name' => $name, 'present' => $present, 'severity' => $sev,
            'value' => $present && isset($h[$key]) ? mb_substr($h[$key], 0, 180) : null,
            'advice' => $desc,
        ];
    }
    $pct = $max ? $score / $max : 0;
    if ($pct >= 0.95) $grade = 'A';
    elseif ($pct >= 0.8) $grade = 'B';
    elseif ($pct >= 0.6) $grade = 'C';
    elseif ($pct >= 0.4) $grade = 'D';
    else $grade = 'F';
    return ['checks' => $checks, 'grade' => $grade, 'score' => $score, 'max' => $max];
}
