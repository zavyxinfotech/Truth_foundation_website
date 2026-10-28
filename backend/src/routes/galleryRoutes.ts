import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { query } from '../db/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Configure Multer for in-memory uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos and images
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// GET /api/gallery (Public & Admin: List gallery images)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let queryText = 'SELECT * FROM gallery_images';
    const params: any[] = [];

    if (category && category !== 'All') {
      queryText += ' WHERE category = $1';
      params.push(category);
    }

    queryText += ' ORDER BY created_at DESC';
    const result = await query(queryText, params);
    res.json({ images: result.rows });
  } catch (error) {
    console.error('Fetch gallery error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// POST /api/gallery/upload (Admin: Upload image or video to Cloudinary & store in Supabase)
router.post('/upload', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No media file provided' });
      return;
    }

    const { title, category = 'General', description } = req.body;
    const isVideo = req.file.mimetype.startsWith('video/');

    // Upload buffer to Cloudinary
    const uploadStream = () =>
      new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const streamOptions: any = {
          folder: 'truth_foundation_gallery',
          resource_type: isVideo ? 'video' : 'image',
        };
        if (!isVideo) {
          streamOptions.format = 'webp';
          streamOptions.quality = 'auto';
        }

        const stream = cloudinary.uploader.upload_stream(
          streamOptions,
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
        stream.end(req.file!.buffer);
      });

    const cloudinaryResult = await uploadStream();

    // Insert image into Supabase gallery_images table
    const dbResult = await query(
      `INSERT INTO gallery_images (title, category, image_url, cloudinary_public_id, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        title || req.file.originalname,
        category,
        cloudinaryResult.secure_url,
        cloudinaryResult.public_id,
        description || null
      ]
    );

    res.status(201).json({
      message: 'Image uploaded successfully to Cloudinary',
      image: dbResult.rows[0]
    });
  } catch (error) {
    console.error('Gallery upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// PUT /api/gallery/:id (Admin: Edit gallery item details or replace image)
router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const findResult = await query('SELECT * FROM gallery_images WHERE id = $1', [id]);
    if (findResult.rows.length === 0) {
      res.status(404).json({ error: 'Gallery image not found' });
      return;
    }

    const existing = findResult.rows[0];
    const { title, category, description, featured } = req.body;

    let finalImageUrl = existing.image_url;
    let cloudinaryPublicId = existing.cloudinary_public_id;

    if (req.file) {
      if (existing.cloudinary_public_id) {
        try {
          await cloudinary.uploader.destroy(existing.cloudinary_public_id);
        } catch (cErr) {
          console.warn('Could not delete old Cloudinary image:', cErr);
        }
      }

      const uploadStream = () =>
        new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'truth_foundation_gallery',
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
          stream.end(req.file!.buffer);
        });

      const uploadRes = await uploadStream();
      finalImageUrl = uploadRes.secure_url;
      cloudinaryPublicId = uploadRes.public_id;
    }

    const updateResult = await query(
      `UPDATE gallery_images SET
        title = $1,
        category = $2,
        image_url = $3,
        cloudinary_public_id = $4,
        description = $5,
        featured = $6
       WHERE id = $7
       RETURNING *`,
      [
        title !== undefined ? title : existing.title,
        category !== undefined ? category : existing.category,
        finalImageUrl,
        cloudinaryPublicId,
        description !== undefined ? description : existing.description,
        featured !== undefined ? featured : existing.featured,
        id
      ]
    );

    res.json({
      message: 'Gallery item updated successfully',
      image: updateResult.rows[0]
    });
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ error: 'Failed to update gallery image' });
  }
});

// DELETE /api/gallery/:id (Admin: Delete image from Cloudinary & Supabase)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const findResult = await query('SELECT * FROM gallery_images WHERE id = $1', [id]);
    if (findResult.rows.length === 0) {
      res.status(404).json({ error: 'Gallery image not found' });
      return;
    }

    const image = findResult.rows[0];

    // Delete from Cloudinary if public_id exists
    if (image.cloudinary_public_id) {
      try {
        await cloudinary.uploader.destroy(image.cloudinary_public_id);
      } catch (cErr) {
        console.warn('Could not delete from Cloudinary:', cErr);
      }
    }

    // Delete from database
    await query('DELETE FROM gallery_images WHERE id = $1', [id]);
    res.json({ message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
});

export default router;
