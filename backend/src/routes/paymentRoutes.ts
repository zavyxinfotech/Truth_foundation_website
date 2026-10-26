import { Router } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { query } from '../db/db.js';

const router = Router();

function getRazorpayConfig() {
  const key_id = (process.env.RAZORPAY_KEY_ID || 'rzp_live_TkcXDVNE0IJstM').trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const client = (key_id && key_secret) ? new Razorpay({ key_id, key_secret }) : null;
  return { key_id, key_secret, client };
}

// POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { currency = 'INR', receipt } = req.body;
    const { key_id, key_secret, client } = getRazorpayConfig();

    // Determine amount in both paise (for Razorpay) and rupees (for display/db)
    let amountInPaise: number;
    let amountInRupees: number;

    if (req.body.amountInPaise) {
      amountInPaise = Math.round(Number(req.body.amountInPaise));
      amountInRupees = amountInPaise / 100;
    } else {
      amountInRupees = Number(req.body.amountInRupees ?? req.body.amount ?? 500);
      amountInPaise = Math.round(amountInRupees * 100);
    }

    if (!amountInPaise || amountInPaise < 100) {
      res.status(400).json({ error: 'Donation amount must be at least ₹1 (100 paise)' });
      return;
    }

    if (!key_secret || !client) {
      // In development / demo mode when secret is not configured
      const mockOrderId = `order_sim_${Date.now()}`;
      res.json({
        order_id: mockOrderId,
        amount: amountInPaise,
        amount_in_rupees: amountInRupees,
        currency,
        key_id,
        isSimulated: true,
        message: 'Simulated Order (Configure RAZORPAY_KEY_SECRET in .env for live gateway)'
      });
      return;
    }

    const order = await client.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    res.json({
      order_id: order.id,
      amount: order.amount,
      amount_in_rupees: amountInRupees,
      currency: order.currency,
      key_id,
      isSimulated: false
    });
  } catch (error: any) {
    console.error('Razorpay create-order error:', error);
    res.status(500).json({ error: error?.message || 'Failed to create Razorpay order' });
  }
});

// POST /api/payment/verify-payment
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donor_details,
      amount
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      res.status(400).json({ error: 'Missing payment details' });
      return;
    }

    const { key_secret } = getRazorpayConfig();
    let isValid = true;
    if (key_secret && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(body)
        .digest('hex');
      isValid = expectedSignature === razorpay_signature;
    }

    if (!isValid) {
      res.status(400).json({ error: 'Payment signature verification failed' });
      return;
    }

    // Record verified donation into Supabase PostgreSQL
    let donationRecord = null;
    if (donor_details && amount) {
      const receiptNumber = `TF-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
      const result = await query(
        `INSERT INTO donations (
          donor_name, email, phone, pan_number, amount, frequency,
          is_eighty_g, payment_method, razorpay_order_id, razorpay_payment_id,
          razorpay_signature, status, receipt_number
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'SUCCESS', $12)
        RETURNING *`,
        [
          donor_details.fullName || 'Anonymous Donor',
          donor_details.email || 'donor@truthfoundation.org',
          donor_details.phone || null,
          donor_details.panNumber || null,
          parseFloat(req.body.amountInRupees ?? (amount ? amount : (req.body.amountInPaise ? req.body.amountInPaise / 100 : 500))),
          donor_details.frequency || 'One-time',
          !!donor_details.isEightYGRequired,
          'Razorpay',
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature || 'simulated_signature',
          receiptNumber
        ]
      );
      donationRecord = result.rows[0];
    }

    res.json({
      status: 'success',
      verified: true,
      donation: donationRecord
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

export default router;
