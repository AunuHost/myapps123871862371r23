
<?php
// php/oxapay-callback.php
// Example legacy callback endpoint from Oxapay into PHP.

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// TODO: validate Oxapay signature using API key.
// TODO: forward to internal Next.js API with a secret key if needed.

file_put_contents(__DIR__ . "/oxapay-log.txt", date("c") . " :: " . $raw . PHP_EOL, FILE_APPEND);

http_response_code(200);
echo "OK";
