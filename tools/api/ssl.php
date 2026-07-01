<?php
declare(strict_types=1);
require __DIR__ . '/_guard.php';

jo_rate_limit(20, 60);

$input = $_GET['url'] ?? $_POST['url'] ?? '';
if (!is_string($input) || $input === '') jo_fail('Please enter a website address.');

// Reuse the SSRF-safe parser (forces https default, validates public IPs).
if (!preg_match('~^https?://~i', $input)) $input = 'https://' . $input;
$t = jo_parse_target($input);
$host = $t['host'];
$ip = $t['ips'][0];
$port = 443;

$ctx = stream_context_create(['ssl' => [
    'capture_peer_cert' => true,
    'verify_peer' => false,
    'verify_peer_name' => false,
    'SNI_enabled' => true,
    'peer_name' => $host,
]]);

$errno = 0; $errstr = '';
// Connect to the validated IP; SNI/cert name uses $host.
$remote = (strpos($ip, ':') !== false) ? "ssl://[$ip]:$port" : "ssl://$ip:$port";
$client = @stream_socket_client($remote, $errno, $errstr, JO_TIMEOUT, STREAM_CLIENT_CONNECT, $ctx);
if (!$client) {
    jo_fail('Could not establish a TLS connection to ' . $host . ' on port 443.', 502);
}
$params = stream_context_get_params($client);
fclose($client);

if (empty($params['options']['ssl']['peer_certificate'])) {
    jo_fail('No certificate was returned by the server.', 502);
}
$cert = openssl_x509_parse($params['options']['ssl']['peer_certificate']);
if (!$cert) jo_fail('Could not parse the certificate.', 502);

$now = time();
$validFrom = $cert['validFrom_time_t'] ?? 0;
$validTo = $cert['validTo_time_t'] ?? 0;
$daysLeft = (int)floor(($validTo - $now) / 86400);

$subjectCN = $cert['subject']['CN'] ?? ($cert['subject']['O'] ?? '—');
$issuerCN = $cert['issuer']['CN'] ?? ($cert['issuer']['O'] ?? '—');
$issuerO = $cert['issuer']['O'] ?? '';
$selfSigned = ($cert['subject'] == $cert['issuer']);

$sans = [];
if (!empty($cert['extensions']['subjectAltName'])) {
    foreach (explode(',', $cert['extensions']['subjectAltName']) as $s) {
        $s = trim($s);
        if (stripos($s, 'DNS:') === 0) $sans[] = substr($s, 4);
    }
}

// Grade
if ($validTo === 0 || $now > $validTo) { $grade = 'F'; $state = 'Expired'; }
elseif ($now < $validFrom) { $grade = 'F'; $state = 'Not yet valid'; }
elseif ($selfSigned) { $grade = 'D'; $state = 'Self-signed'; }
elseif ($daysLeft < 7) { $grade = 'D'; $state = 'Expiring very soon'; }
elseif ($daysLeft < 30) { $grade = 'C'; $state = 'Expiring soon'; }
else { $grade = 'A'; $state = 'Valid'; }

$sigAlg = $cert['signatureTypeSN'] ?? ($cert['signatureTypeLN'] ?? '—');
$weakSig = (stripos((string)$sigAlg, 'sha1') !== false || stripos((string)$sigAlg, 'md5') !== false);
if ($weakSig && $grade === 'A') $grade = 'C';

jo_send([
    'ok' => true,
    'host' => $host,
    'grade' => $grade,
    'state' => $state,
    'subject' => $subjectCN,
    'issuer' => $issuerCN,
    'issuerOrg' => $issuerO,
    'selfSigned' => $selfSigned,
    'validFrom' => $validFrom ? gmdate('Y-m-d', $validFrom) : '—',
    'validTo' => $validTo ? gmdate('Y-m-d', $validTo) : '—',
    'daysLeft' => $daysLeft,
    'signature' => $sigAlg,
    'weakSignature' => $weakSig,
    'altNames' => array_slice($sans, 0, 30),
    'altNamesCount' => count($sans),
]);
