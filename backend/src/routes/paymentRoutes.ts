import { Router } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { query } from '../db/db.js';

const router = Router();

const KEY_ID = process.env.RAZORPAY_KEY_ID?.trim();
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET?.trim();

let razorpay: Razorpay | null = null;
if (KEY_ID && KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
  });
}

// POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount < 100) {
      res.status(400).json({ error: 'Amount must be at least 100 paise (₹1)' });
      return;
    }

    if (!KEY_ID || !KEY_SECRET || !razorpay) {
      // In development / demo mode when secret is pending, return simulated order_id
      const mockOrderId = `order_sim_${Date.now()}`;
      res.json({
        order_id: mockOrderId,
        amount,
        currency,
        isSimulated: true,
        message: 'Simulated Order (Configure RAZORPAY_KEY_SECRET in .env for live gateway)'
      });
      return;
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      isSimulated: false
    });
  } catch (error: any) {
    console.error('Razorpay create-order error:', error);
    res.status(500).json({ error: error?.message || 'Failed to create order' });
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

    let isValid = true;
    if (KEY_SECRET && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', KEY_SECRET)
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
          parseFloat(amount),
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
