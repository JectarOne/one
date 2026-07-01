<?php
declare(strict_types=1);
require __DIR__ . '/_guard.php';

jo_rate_limit(20, 60);

$url = $_GET['url'] ?? $_POST['url'] ?? '';
if (!is_string($url) || $url === '') jo_fail('Please enter a website address.');

$r = jo_fetch($url);
$analysis = jo_analyze_headers($r['headers']);

$disclosure = [];
if (!empty($r['headers']['server'])) $disclosure['Server'] = $r['headers']['server'];
if (!empty($r['headers']['x-powered-by'])) $disclosure['X-Powered-By'] = $r['headers']['x-powered-by'];

jo_send([
    'ok' => true,
    'target' => $r['host'],
    'finalUrl' => $r['finalUrl'],
    'status' => $r['status'],
    'grade' => $analysis['grade'],
    'score' => $analysis['score'],
    'max' => $analysis['max'],
    'checks' => $analysis['checks'],
    'disclosure' => $disclosure,
    'redirects' => count($r['hops']) - 1,
]);
