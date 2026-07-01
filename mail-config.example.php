<?php
// Copy this file to mail-config.php (same directory) and fill in real values.
// mail-config.php is gitignored — it holds a real password and must NEVER be committed.
//
// These are standard cPanel mailbox SMTP settings. In cPanel, go to
// Email Accounts -> (contact@jectar.one) -> Connect Devices to see the
// exact "Mail Client Manual Settings" (Outgoing/SMTP) for this account —
// host, port, and encryption are shown there. They usually look like this:

return [
    'smtp_host'       => 'mail.jectar.one',   // often "mail.<yourdomain>" or the server hostname shown in cPanel
    'smtp_port'       => 465,                 // 465 = SSL (SMTPS), or 587 = STARTTLS
    'smtp_secure'     => 'ssl',               // 'ssl' for port 465, 'tls' for port 587
    'smtp_username'   => 'contact@jectar.one',
    'smtp_password'   => 'REPLACE-WITH-THE-REAL-MAILBOX-PASSWORD',
    'from_email'      => 'contact@jectar.one',
    'from_name'       => 'JectarOne Website',
    'to_email'        => 'contact@jectar.one',
];
