import { Router } from 'express';
import { query } from '../db/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/contact (Public: Submit message)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required' });
      return;
    }

    const result = await query(
      `INSERT INTO contact_inquiries (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name.trim(), email.trim(), phone?.trim() || null, subject?.trim() || null, message.trim()]
    );

    res.status(201).json({
      message: 'Thank you for reaching out! We will contact you shortly.',
      inquiry: result.rows[0]
    });
  } catch (error) {
    console.error('Contact inquiry error:', error);
    res.status(500).json({ error: 'Failed to submit contact inquiry' });
  }
});

// GET /api/contact (Admin: View inquiries)
router.get('/', requireAuth, async (_req, res) => {
  try {
    const result = await query('SELECT * FROM contact_inquiries ORDER BY created_at DESC');
    res.json({ inquiries: result.rows });
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch contact inquiries' });
  }
});

// PATCH /api/contact/:id (Admin: Update status)
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await query(
      'UPDATE contact_inquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json({ message: 'Inquiry status updated', inquiry: result.rows[0] });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// DELETE /api/contact/:id (Admin: Delete inquiry)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM contact_inquiries WHERE id = $1', [id]);
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

export default router;
