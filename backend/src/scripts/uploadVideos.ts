import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';
import { query } from '../db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function uploadVideoToCloudinary(filePath: string, publicId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        resource_type: 'video',
        folder: 'truth_foundation_gallery',
        public_id: publicId,
        overwrite: true
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function uploadVideos() {
  console.log('🚀 Starting video upload to Cloudinary & Supabase database...');

  const videoFiles = [
    {
      fileName: 'video3.mp4',
      publicId: 'truth_foundation_field_video_3',
      title: 'Children Nutrition & Daily Campus Care',
      category: 'Videos',
      description: 'Field video documenting daily wholesome meal preparation, nutrition support, and loving environment at Truth Foundation Redhills campus.'
    },
    {
      fileName: 'video4.mp4',
      publicId: 'truth_foundation_field_video_4',
      title: 'Rural Evening Tuition & Youth Empowerment',
      category: 'Videos',
      description: 'Field video highlighting education support, evening tuition classes, textbooks, and hygiene kit distribution across rural centers.'
    }
  ];

  for (const item of videoFiles) {
    const videoPath = path.resolve(__dirname, '../../../frontend/src/assets/videos', item.fileName);
    console.log(`\n⏳ Uploading ${item.fileName} (${videoPath}) to Cloudinary...`);

    try {
      const uploadRes = await uploadVideoToCloudinary(videoPath, item.publicId);

      console.log(`✔ Uploaded successfully to Cloudinary!`);
      console.log(`  Public ID: ${uploadRes.public_id}`);
      console.log(`  Secure URL: ${uploadRes.secure_url}`);
      console.log(`  Format: ${uploadRes.format}, Duration: ${uploadRes.duration?.toFixed(1)}s, Size: ${(uploadRes.bytes / (1024 * 1024)).toFixed(2)} MB`);

      // Check if already in database by cloudinary_public_id
      const existing = await query(
        `SELECT id FROM gallery_images WHERE cloudinary_public_id = $1 OR image_url = $2`,
        [uploadRes.public_id, uploadRes.secure_url]
      );

      let dbRow;
      if (existing.rows.length > 0) {
        const updateRes = await query(
          `UPDATE gallery_images 
           SET title = $1, category = $2, image_url = $3, description = $4, featured = true
           WHERE id = $5
           RETURNING *`,
          [item.title, item.category, uploadRes.secure_url, item.description, existing.rows[0].id]
        );
        dbRow = updateRes.rows[0];
        console.log(`✔ Updated existing row in Supabase gallery_images (ID: ${dbRow.id})`);
      } else {
        const insertRes = await query(
          `INSERT INTO gallery_images (title, category, image_url, cloudinary_public_id, description, featured, display_order)
           VALUES ($1, $2, $3, $4, $5, true, 0)
           RETURNING *`,
          [item.title, item.category, uploadRes.secure_url, uploadRes.public_id, item.description]
        );
        dbRow = insertRes.rows[0];
        console.log(`✔ Inserted new row in Supabase gallery_images (ID: ${dbRow.id})`);
      }

      console.log(`  Database Record:`, JSON.stringify(dbRow, null, 2));
    } catch (err) {
      console.error(`❌ Error uploading ${item.fileName}:`, err);
    }
  }

  // Print all videos in gallery_images
  console.log('\n🔍 Verifying all Video items currently stored in Supabase database:');
  const verifyRes = await query(`SELECT id, title, category, image_url, cloudinary_public_id, created_at FROM gallery_images WHERE category = 'Videos'`);
  console.table(verifyRes.rows);

  process.exit(0);
}

uploadVideos().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
