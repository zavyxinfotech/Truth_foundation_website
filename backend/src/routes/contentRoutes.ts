import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { query } from '../db/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Configure Multer for in-memory image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Helper: Upload file buffer to Cloudinary
function uploadToCloudinary(buffer: Buffer, folder = 'truth_foundation_cms') {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        format: 'webp',
        quality: 'auto'
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id
          });
        }
      }
    );
    stream.end(buffer);
  });
}

// POST /api/content/upload-image (Admin: Upload any image to Cloudinary)
router.post('/upload-image', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }
    const folder = (req.body.folder as string) || 'truth_foundation_cms';
    const uploadRes = await uploadToCloudinary(req.file.buffer, folder);
    res.json({
      message: 'Image uploaded successfully to Cloudinary',
      secure_url: uploadRes.secure_url,
      public_id: uploadRes.public_id
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload image to Cloudinary' });
  }
});

// GET /api/content (Public & Admin: Fetch all site content)
router.get('/', async (_req, res) => {
  try {
    const result = await query('SELECT section_key, content_json, updated_at FROM site_content');
    const contentMap: Record<string, any> = {};
    for (const row of result.rows) {
      contentMap[row.section_key] = row.content_json;
    }
    res.json({
      success: true,
      content: contentMap,
      raw: result.rows
    });
  } catch (error: any) {
    console.error('Fetch site content error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch site content' });
  }
});

// GET /api/content/:section_key (Public: Fetch specific section)
router.get('/:section_key', async (req, res) => {
  try {
    const { section_key } = req.params;
    const result = await query(
      'SELECT section_key, content_json, updated_at FROM site_content WHERE section_key = $1',
      [section_key]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: `Section '${section_key}' not found` });
      return;
    }
    res.json({
      section_key,
      data: result.rows[0].content_json,
      updated_at: result.rows[0].updated_at
    });
  } catch (error: any) {
    console.error('Fetch section error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch section' });
  }
});

// PUT /api/content/:section_key (Admin: Update section JSON content)
router.put('/:section_key', requireAuth, async (req, res) => {
  try {
    const { section_key } = req.params;
    const content_json = req.body;

    if (!content_json || typeof content_json !== 'object') {
      res.status(400).json({ error: 'Valid JSON body is required' });
      return;
    }

    const result = await query(
      `INSERT INTO site_content (section_key, content_json, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (section_key) DO UPDATE SET
         content_json = EXCLUDED.content_json,
         updated_at = CURRENT_TIMESTAMP
       RETURNING section_key, content_json, updated_at`,
      [section_key, JSON.stringify(content_json)]
    );

    res.json({
      message: `Section '${section_key}' updated successfully`,
      data: result.rows[0].content_json,
      updated_at: result.rows[0].updated_at
    });
  } catch (error: any) {
    console.error('Update section error:', error);
    res.status(500).json({ error: error.message || 'Failed to update section' });
  }
});

// DELETE /api/content/:section_key (Admin: Delete section if needed)
router.delete('/:section_key', requireAuth, async (req, res) => {
  try {
    const { section_key } = req.params;
    await query('DELETE FROM site_content WHERE section_key = $1', [section_key]);
    res.json({ message: `Section '${section_key}' deleted successfully` });
  } catch (error: any) {
    console.error('Delete section error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete section' });
  }
});

export default router;
