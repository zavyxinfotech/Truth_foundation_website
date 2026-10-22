import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { execSync } from 'child_process';

const app = express();
app.use(express.json());

const KEY_ID = process.env.RAZORPAY_KEY_ID?.trim();
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET?.trim();

let razorpay: Razorpay | null = null;
if (KEY_ID && KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
  });
} else {
  console.warn('⚠️ WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in environment variables.');
}

// Health check endpoint for verifying cPanel Passenger / Local routing
app.get(['/', '/api', '/api/', '/health', '/api/health'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Truth Foundation Razorpay Backend API',
    razorpayConfigured: !!(KEY_ID && KEY_SECRET),
    timestamp: new Date().toISOString()
  });
});

// POST /api/create-order (handles both trailing slash & cPanel Passenger URI stripping)
app.post(['/api/create-order', '/api/create-order/', '/create-order', '/create-order/'], async (req, res) => {
  try {
    if (!KEY_ID || !KEY_SECRET || !razorpay) {
      res.status(500).json({
        error: 'Razorpay API credentials (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are missing on server .env'
      });
      return;
    }

    const { amount, currency = 'INR', receipt } = req.body as {
      amount: number;
      currency?: string;
      receipt?: string;
    };

    if (!amount || amount < 100) {
      res.status(400).json({ error: 'Amount must be at least 100 paise (₹1)' });
      return;
    }

    const order = await razorpay.orders.create({
      amount,              // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: any) {
    console.error('create-order error:', err);
    const errDesc = err?.error?.description || err?.message || '';
    if (err.statusCode === 401 || errDesc.toLowerCase().includes('authentication failed')) {
      res.status(401).json({ error: 'Razorpay API Authentication Failed. Please verify your KEY_ID and KEY_SECRET in .env.' });
      return;
    }
    const status = err.statusCode || 500;
    res.status(status).json({
      error: errDesc || 'Failed to create Razorpay order'
    });
  }
});

// POST /api/verify-payment
app.post(['/api/verify-payment', '/api/verify-payment/', '/verify-payment', '/verify-payment/'], (req, res) => {
  if (!KEY_SECRET) {
    res.status(500).json({ error: 'Razorpay Key Secret is missing on server .env' });
    return;
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  };

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: 'Missing required payment verification fields' });
    return;
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400).json({ error: 'Payment signature mismatch — possible tampering' });
    return;
  }

  res.json({ success: true, payment_id: razorpay_payment_id });
});

const PORT = Number(process.env.PORT) || 3001;

function freePort(port: number) {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`).toString();
      for (const line of output.split('\n')) {
        if (line.includes('LISTENING')) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== process.pid.toString() && pid !== '0') {
            try { execSync(`taskkill /F /PID ${pid}`); } catch (_) {}
          }
        }
      }
    } else {
      try { execSync(`fuser -k ${port}/tcp`); } catch (_) {}
    }
  } catch (_) {}
}

if (process.env.NODE_ENV !== 'production') {
  freePort(PORT);
}

const server = app.listen(PORT, () => {
  console.log(`✅ Truth Foundation API server running on http://localhost:${PORT}`);
  console.log(`   Razorpay integration initialized successfully`);
});

server.on('error', (err: any) => {
  console.error('❌ Server error:', err);
});
