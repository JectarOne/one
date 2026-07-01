<?php
declare(strict_types=1);

// JectarOne contact form handler. Sends the submission to contact@jectar.one.
// Works with JS (fetch, returns JSON) and without JS (redirects back to the page).

function jo_is_ajax(): bool {
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $xrw = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    return stripos($accept, 'application/json') !== false || strtolower($xrw) === 'fetch';
}

function jo_respond(bool $ok, string $message): void {
    if (jo_is_ajax()) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($ok ? 200 : 400);
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
    header('Location: /index.html?sent=' . ($ok ? '1' : '0') . '#contact');
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    jo_respond(false, 'Invalid request method.');
}

// Honeypot: real visitors never fill this field (hidden off-screen via CSS).
if (!empty($_POST['website'])) {
    jo_respond(true, "Thanks — we've received your request and will be in touch shortly.");
}

// Rate limit: max 5 submissions per 10 minutes per IP.
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$dir = sys_get_temp_dir() . '/jo_contact_rl';
@mkdir($dir, 0700, true);
$key = $dir . '/' . hash('sha256', $ip);
$now = time();
$window = 600;
$limit = 5;
$hits = [];
if (is_file($key)) {
    $raw = @file_get_contents($key);
    $hits = $raw ? array_filter(array_map('intval', explode(',', $raw)), function ($t) use ($now, $window) {
        return $t > $now - $window;
    }) : [];
}
if (count($hits) >= $limit) {
    jo_respond(false, 'Too many requests. Please try again in a few minutes.');
}
$hits[] = $now;
@file_put_contents($key, implode(',', $hits), LOCK_EX);

function jo_clean(string $s, int $max): string {
    $s = trim($s);
    $s = preg_replace('/[\r\n]+/', ' ', $s); // guard against mail header injection
    return mb_substr($s, 0, $max);
}

$name = jo_clean((string)($_POST['name'] ?? ''), 120);
$company = jo_clean((string)($_POST['company'] ?? ''), 160);
$email = jo_clean((string)($_POST['email'] ?? ''), 200);
$serviceRaw = (string)($_POST['service'] ?? '');
$message = mb_substr(trim((string)($_POST['message'] ?? '')), 0, 5000);

$allowedServices = [
    'Security Assessment', 'Vulnerability Assessment', 'Penetration Testing',
    'Web Application Security', 'Security Awareness', 'Compliance Readiness', 'Not sure yet',
];
$service = in_array($serviceRaw, $allowedServices, true) ? $serviceRaw : 'Not sure yet';

if ($name === '' || $email === '') {
    jo_respond(false, 'Please fill in your name and email.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jo_respond(false, 'Please enter a valid email address.');
}

$to = 'contact@jectar.one';
$subject = 'New assessment request from ' . $name;

$bodyLines = [
    'New request from the jectar.one contact form',
    '',
    'Name: ' . $name,
    'Company: ' . ($company !== '' ? $company : '—'),
    'Email: ' . $email,
    'Service of interest: ' . $service,
    '',
    'Message:',
    $message !== '' ? $message : '(no message provided)',
    '',
    '--',
    'Sent from https://jectar.one/ · IP: ' . $ip,
];
$body = implode("\n", $bodyLines);

$headers = implode("\r\n", [
    'From: JectarOne Website <no-reply@jectar.one>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
]);

$sent = @mail($to, $subject, $body, $headers);

if ($sent) {
    jo_respond(true, "Thanks — we've received your request and will be in touch shortly.");
}
jo_respond(false, 'Something went wrong sending your message. Please email us directly at contact@jectar.one.');
