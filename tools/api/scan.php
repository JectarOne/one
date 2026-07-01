<?php
declare(strict_types=1);
require __DIR__ . '/_guard.php';

jo_rate_limit(12, 60);

$url = $_GET['url'] ?? $_POST['url'] ?? '';
if (!is_string($url) || $url === '') jo_fail('Please enter a website address.');

$r = jo_fetch($url);
$h = $r['headers'];
$checks = [];
$pass = 0; $total = 0;

function jo_add(&$checks, &$pass, &$total, string $status, string $name, string $desc, ?string $val = null) {
    if ($status !== 'info') { $total++; if ($status === 'pass') $pass++; }
    $checks[] = ['status' => $status, 'name' => $name, 'desc' => $desc, 'value' => $val];
}

// 1) HTTPS
$isHttps = (strpos($r['finalUrl'], 'https://') === 0);
jo_add($checks, $pass, $total, $isHttps ? 'pass' : 'fail', 'HTTPS enabled',
    $isHttps ? 'The site is served over HTTPS.' : 'The site is not served over HTTPS.', $r['finalUrl']);

// 2) Security headers (reuse analyzer)
$an = jo_analyze_headers($h);
foreach ($an['checks'] as $c) {
    jo_add($checks, $pass, $total, $c['present'] ? 'pass' : ($c['severity'] === 'high' ? 'fail' : 'warn'),
        $c['name'], $c['advice'], $c['value']);
}

// 3) Information disclosure
$server = $h['server'] ?? '';
$hasVer = $server !== '' && preg_match('~\d~', $server);
jo_add($checks, $pass, $total, $hasVer ? 'warn' : ($server ? 'pass' : 'info'),
    'Server header', $hasVer ? 'Server header reveals software/version — consider hiding it.' : 'No version info leaked in the Server header.',
    $server ?: null);
if (!empty($h['x-powered-by'])) {
    jo_add($checks, $pass, $total, 'warn', 'X-Powered-By header',
        'Reveals backend technology — best removed.', $h['x-powered-by']);
}

// 4) Cookies
if (!empty($r['setCookies'])) {
    $bad = [];
    foreach ($r['setCookies'] as $ck) {
        $nm = trim(explode('=', $ck, 2)[0]);
        $flags = [];
        if (stripos($ck, 'secure') === false) $flags[] = 'Secure';
        if (stripos($ck, 'httponly') === false) $flags[] = 'HttpOnly';
        if (stripos($ck, 'samesite') === false) $flags[] = 'SameSite';
        if ($flags) $bad[] = $nm . ' (missing ' . implode(', ', $flags) . ')';
    }
    jo_add($checks, $pass, $total, $bad ? 'warn' : 'pass', 'Cookie flags',
        $bad ? 'Some cookies are missing recommended flags.' : 'Cookies set with recommended flags.',
        $bad ? implode('; ', array_slice($bad, 0, 4)) : null);
}

// 5) Mixed content hint
if ($isHttps && $r['body']) {
    if (preg_match('~(?:src|href)\s*=\s*["\']http://~i', $r['body'])) {
        jo_add($checks, $pass, $total, 'warn', 'Mixed content',
            'Page references some resources over plain http://.');
    } else {
        jo_add($checks, $pass, $total, 'pass', 'Mixed content',
            'No obvious insecure (http://) resource references found.');
    }
}

$pct = $total ? $pass / $total : 0;
if ($pct >= 0.9) $grade = 'A';
elseif ($pct >= 0.75) $grade = 'B';
elseif ($pct >= 0.6) $grade = 'C';
elseif ($pct >= 0.4) $grade = 'D';
else $grade = 'F';

jo_send([
    'ok' => true,
    'target' => $r['host'],
    'finalUrl' => $r['finalUrl'],
    'status' => $r['status'],
    'grade' => $grade,
    'passed' => $pass,
    'total' => $total,
    'checks' => $checks,
]);
