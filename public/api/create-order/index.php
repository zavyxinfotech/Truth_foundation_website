<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$key_id = getenv('RAZORPAY_KEY_ID') ?: 'rzp_live_TkcXDVNE0IJstM';
$key_secret = getenv('RAZORPAY_KEY_SECRET') ?: '';

// Search for .env file in parent directories
$envPaths = [
    __DIR__ . '/../../.env',
    __DIR__ . '/../../../.env',
    $_SERVER['DOCUMENT_ROOT'] . '/.env'
];

foreach ($envPaths as $path) {
    if (file_exists($path)) {
        $envLines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($envLines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($name, $value) = explode('=', $line, 2);
                $name = trim($name);
                $value = trim($value, " \t\n\r\0\x0B\"'");
                if ($name === 'RAZORPAY_KEY_ID' && !empty($value)) $key_id = $value;
                if ($name === 'RAZORPAY_KEY_SECRET' && !empty($value)) $key_secret = $value;
            }
        }
        break;
    }
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

$amount = isset($input['amount']) ? intval($input['amount']) : 0;
$currency = isset($input['currency']) ? $input['currency'] : 'INR';
$receipt = isset($input['receipt']) ? $input['receipt'] : ('rcpt_' . time());

if ($amount < 100) {
    http_response_code(400);
    echo json_encode(['error' => 'Amount must be at least 100 paise (₹1)']);
    exit;
}

if (empty($key_secret)) {
    http_response_code(500);
    echo json_encode(['error' => 'RAZORPAY_KEY_SECRET is not configured on server .env']);
    exit;
}

$ch = curl_init('https://api.razorpay.com/v1/orders');
curl_setopt($ch, CURLOPT_USERPWD, $key_id . ':' . $key_secret);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'amount' => $amount,
    'currency' => $currency,
    'receipt' => $receipt
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($http_code ? $http_code : 500);
echo $response;
