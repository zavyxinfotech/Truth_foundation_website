import { Router } from 'express';
import { query } from '../db/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/donations/stats (Public / Admin: Summary metrics)
router.get('/stats', async (_req, res) => {
  try {
    const statsResult = await query(`
      SELECT 
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(id) as total_donors,
        COALESCE(SUM(CASE WHEN frequency = 'Monthly' THEN amount ELSE 0 END), 0) as monthly_recurring_amount,
        COALESCE(SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN amount ELSE 0 END), 0) as last_30_days_amount
      FROM donations
      WHERE status = 'SUCCESS'
    `);

    const stats = statsResult.rows[0];
    const totalAmount = parseFloat(stats.total_amount) || 0;
    const mealsFunded = Math.floor(totalAmount / 20); // ₹20 per meal

    res.json({
      totalAmount,
      totalDonors: parseInt(stats.total_donors, 10) || 0,
      mealsFunded,
      monthlyRecurringAmount: parseFloat(stats.monthly_recurring_amount) || 0,
      last30DaysAmount: parseFloat(stats.last_30_days_amount) || 0
    });
  } catch (error) {
    console.error('Donation stats error:', error);
    res.status(500).json({ error: 'Failed to fetch donation statistics' });
  }
});

// GET /api/donations (Admin: List all donations with search & filter)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { search, frequency, status, limit = 50, offset = 0 } = req.query;

    let queryText = 'SELECT * FROM donations WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      queryText += ` AND (donor_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex} OR receipt_number ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (frequency) {
      queryText += ` AND frequency = $${paramIndex}`;
      params.push(frequency);
      paramIndex++;
    }

    if (status) {
      queryText += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit as string, 10) || 50, parseInt(offset as string, 10) || 0);

    const result = await query(queryText, params);
    const countResult = await query('SELECT COUNT(*) FROM donations');

    res.json({
      donations: result.rows,
      totalCount: parseInt(countResult.rows[0].count, 10)
    });
  } catch (error) {
    console.error('Fetch donations error:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
});

// POST /api/donations (Record new donation)
router.post('/', async (req, res) => {
  try {
    const {
      donor_name,
      email,
      phone,
      pan_number,
      amount,
      frequency = 'One-time',
      is_eighty_g = false,
      payment_method = 'Razorpay',
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      notes
    } = req.body;

    if (!donor_name || !email || !amount) {
      res.status(400).json({ error: 'Donor name, email, and amount are required' });
      return;
    }

    const receiptNumber = `TF-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const insertResult = await query(
      `INSERT INTO donations (
        donor_name, email, phone, pan_number, amount, frequency,
        is_eighty_g, payment_method, razorpay_order_id, razorpay_payment_id,
        razorpay_signature, status, receipt_number, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'SUCCESS', $12, $13)
      RETURNING *`,
      [
        donor_name,
        email,
        phone || null,
        pan_number || null,
        parseFloat(amount),
        frequency,
        !!is_eighty_g,
        payment_method,
        razorpay_order_id || null,
        razorpay_payment_id || null,
        razorpay_signature || null,
        receiptNumber,
        notes || null
      ]
    );

    res.status(201).json({
      message: 'Donation recorded successfully',
      donation: insertResult.rows[0]
    });
  } catch (error) {
    console.error('Record donation error:', error);
    res.status(500).json({ error: 'Failed to record donation' });
  }
});

// DELETE /api/donations/:id (Admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM donations WHERE id = $1', [id]);
    res.json({ message: 'Donation record deleted' });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({ error: 'Failed to delete donation' });
  }
});

export default router;
