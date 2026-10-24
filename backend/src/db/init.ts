import { pool, query } from './db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export async function initDatabase() {
  console.log('⚡ Initializing Supabase PostgreSQL Database tables...');

  try {
    // 1. Admin Users Table
    await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) DEFAULT 'Truth Foundation Admin',
        role VARCHAR(50) DEFAULT 'SUPERADMIN',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✔ Table "admin_users" ready');

    // 2. Donations Table
    await query(`
      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        donor_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        pan_number VARCHAR(20),
        amount NUMERIC(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        frequency VARCHAR(20) DEFAULT 'One-time',
        is_eighty_g BOOLEAN DEFAULT false,
        payment_method VARCHAR(50) DEFAULT 'Razorpay',
        razorpay_order_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        razorpay_signature VARCHAR(255),
        status VARCHAR(50) DEFAULT 'SUCCESS',
        receipt_number VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✔ Table "donations" ready');

    // 3. Gallery Images Table
    await query(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        image_url TEXT NOT NULL,
        cloudinary_public_id VARCHAR(255),
        description TEXT,
        featured BOOLEAN DEFAULT false,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✔ Table "gallery_images" ready');

    // 4. Contact Inquiries Table
    await query(`
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'NEW',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✔ Table "contact_inquiries" ready');

    // Seed default admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'zavyxindia@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Truth@2026';

    const checkAdmin = await query('SELECT id FROM admin_users WHERE email = $1', [adminEmail]);
    if (checkAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await query(
        `INSERT INTO admin_users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)`,
        [adminEmail, hashedPassword, 'Truth Foundation Super Admin', 'SUPERADMIN']
      );
      console.log(`✔ Default Admin user created: ${adminEmail}`);
    } else {
      console.log(`ℹ Admin user already exists: ${adminEmail}`);
    }

    console.log('🎉 Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// Allow standalone execution via `npm run db:init`
if (process.argv[1]?.endsWith('init.ts') || process.argv[1]?.endsWith('init.js')) {
  initDatabase().then(() => {
    pool.end();
  }).catch(() => {
    pool.end();
    process.exit(1);
  });
}
