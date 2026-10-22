<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$key_secret = getenv('RAZORPAY_KEY_SECRET') ?: '';

$envPaths = [
    __DIR__ . '/../.env',
    __DIR__ . '/../../.env',
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
                if ($name === 'RAZORPAY_KEY_SECRET' && !empty($value)) $key_secret = $value;
            }
        }
        break;
    }
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

$razorpay_order_id = isset($input['razorpay_order_id']) ? $input['razorpay_order_id'] : '';
$razorpay_payment_id = isset($input['razorpay_payment_id']) ? $input['razorpay_payment_id'] : '';
$razorpay_signature = isset($input['razorpay_signature']) ? $input['razorpay_signature'] : '';

if (!$razorpay_order_id || !$razorpay_payment_id || !$razorpay_signature) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required payment verification fields']);
    exit;
}

if (empty($key_secret)) {
    http_response_code(500);
    echo json_encode(['error' => 'RAZORPAY_KEY_SECRET is not configured on server .env']);
    exit;
}

$generated_signature = hash_hmac('sha256', $razorpay_order_id . '|' . $razorpay_payment_id, $key_secret);

if ($generated_signature !== $razorpay_signature) {
    http_response_code(400);
    echo json_encode(['error' => 'Payment signature mismatch — possible tampering']);
    exit;
}

echo json_encode(['success' => true, 'payment_id' => $razorpay_payment_id]);
