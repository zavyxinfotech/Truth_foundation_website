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

    // 5. Site Content & CMS Table
    await query(`
      CREATE TABLE IF NOT EXISTS site_content (
        id SERIAL PRIMARY KEY,
        page VARCHAR(50) NOT NULL,
        section VARCHAR(100) NOT NULL,
        key VARCHAR(100) NOT NULL,
        title TEXT,
        subtitle TEXT,
        description TEXT,
        tag VARCHAR(100),
        badge VARCHAR(100),
        image_url TEXT,
        cloudinary_public_id VARCHAR(255),
        extra_data JSONB DEFAULT '{}'::jsonb,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_page_section_key UNIQUE (page, section, key)
      );
    `);
    console.log('✔ Table "site_content" ready');

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

    // Seed Initial Site Content if empty
    await seedDefaultSiteContent();

    // Seed Initial Gallery Images if empty
    await seedDefaultGalleryImages();

    console.log('🎉 Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

async function seedDefaultSiteContent() {
  console.log('⚡ Checking and seeding initial site content...');

  // 1. Home Hero Slides
  const checkHero = await query("SELECT section_key FROM site_content WHERE section_key = 'home_hero'");
  if (checkHero.rows.length === 0) {
    const defaultHero = {
      slides: [
        {
          id: 'slide_0',
          title: 'ONE MEAL. ONE SMILE.',
          tagline: 'Your ₹500 can provide warm, nutritious meals to children in need.',
          subtitle: 'Every donation directly funds nutritious meals, education, and healthcare for orphaned children, abandoned seniors, and special needs children.',
          badge: 'Est. 5th July 2010',
          tag: 'Public Charitable Trust',
          image_url: 'assets/images/hero_child_longing_meal.jpg'
        },
        {
          id: 'slide_1',
          title: 'Orphanage Home for Children.',
          tagline: 'Dormitories, Study Halls & Playgrounds in Rural Communities',
          subtitle: 'Managed by 16 committed staff members, providing full shelter, nutrition, healthcare, and education to 45 orphaned children.',
          badge: '45 Resident Boys & Girls',
          tag: 'Our Campus',
          image_url: 'assets/images/hero_redhills_orphanage.jpg'
        },
        {
          id: 'slide_2',
          title: 'Empowering Every Child.',
          tagline: 'Providing Compassionate Care, Structured Learning, and Safe Transportation',
          subtitle: 'Our dedicated professionals provide personalized learning and physical well-being support to foster growth and independence.',
          badge: 'Dedicated Care & Support',
          tag: 'Education Center',
          image_url: 'assets/images/hero_special_needs_care.jpg'
        },
        {
          id: 'slide_3',
          title: '346 Enrolled Children Supported Daily.',
          tagline: 'Serving Marginalized Communities Across 8 Different Centers',
          subtitle: 'Providing free evening tuition, nutritious meals, backpacks, textbooks, pens, and hygiene supplies.',
          badge: 'Free Education & Supplies',
          tag: '8 Tuition Centers',
          image_url: 'assets/images/hero_tuition_school_meals.jpg'
        }
      ]
    };
    await query(
      `INSERT INTO site_content (section_key, content_json, updated_at)
       VALUES ('home_hero', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (section_key) DO UPDATE SET content_json = EXCLUDED.content_json`,
      [JSON.stringify(defaultHero)]
    );
    console.log('✔ Seeded "home_hero" slides');
  }

  // 2. About Page with Programs & Trustees
  const checkAbout = await query("SELECT section_key, content_json FROM site_content WHERE section_key = 'about_page'");
  const aboutData = checkAbout.rows[0]?.content_json || {};
  if (!aboutData.programs || aboutData.programs.length === 0) {
    aboutData.hero_title = aboutData.hero_title || 'Our Story & Vision';
    aboutData.hero_image_url = 'assets/images/truth_foundation_gate.jpg';
    aboutData.cta_image_url = aboutData.cta_image_url || 'assets/images/support_cause_girl_donate.png';
    aboutData.cta_title = aboutData.cta_title || 'Support a Cause. Change a Life.';
    aboutData.cta_subtitle = aboutData.cta_subtitle || 'Your contribution brings hope, education, nourishment, and care to children, elderly, and special-needs individuals across Tamil Nadu.';
    aboutData.programs = [
      {
        id: 'prog_orphanage',
        title: 'Redhills Orphanage Home',
        location: 'Redhills, Northern Chennai',
        tag: '15+ Years Active',
        badge: '41 Children',
        image_url: 'assets/images/hero_redhills_orphanage.jpg',
        description: 'Operating on an acre of land with separate dormitories, study halls, hygienic dining facilities, and playgrounds for 41 resident boys and girls.',
        details: [
          'Separate dormitories & study rooms for boys & girls',
          '16 committed full-time & part-time caregivers',
          'Nutritious 3-meal daily diet & medical checkups',
          'Extracurricular activities & annual sports days'
        ]
      },
      {
        id: 'prog_seniors',
        title: 'Old Age Day Care Center',
        location: 'Redhills Campus, Chennai',
        tag: 'Senior Care',
        badge: '3 Destitute Seniors',
        image_url: 'assets/images/elderly_food_care_drive.jpg',
        description: 'Providing food, shelter, daily essential medication, and loving care for 3 abandoned street elderly people in Redhills.',
        details: [
          'Warm daily meals, snacks, and fruits',
          'Routine health screening and medication management',
          'Safe, clean, recreational community space',
          'Dignified end-of-life care and companionship'
        ]
      },
      {
        id: 'prog_special_needs',
        title: 'Special Needs Learning Center',
        location: 'China Ikaadu, Thiruvallur District',
        tag: 'Thiruvallur District',
        badge: '23 Children with Needs',
        image_url: 'assets/images/hero_special_needs_care.jpg',
        description: 'Doorstep van transportation, personalized therapy, and specialized learning for 23 mentally challenged and disabled children.',
        details: [
          'Dedicated van doorstep pickup and drop across villages',
          'Special education, physiotherapy, and speech training',
          'Free assistive kits, nutritious lunches, and snacks',
          'Family counseling and social integration camps'
        ]
      },
      {
        id: 'prog_tuition',
        title: '8 Evening Tuition & Child Care Centers',
        location: 'North Chennai & Thiruvallur',
        tag: '346 Children Supported',
        badge: '8 Active Centers',
        image_url: 'assets/images/hero_tuition_school_meals.jpg',
        description: 'Free academic tutoring, nutrition, school bags, notebooks, and uniforms for 346 underprivileged children across North Chennai.',
        details: [
          'Daily evening study sessions from 5:30 PM to 7:30 PM',
          'Daily evening nutrition (sundal, biscuits, eggs, milk)',
          'Annual distribution of school bags, stationery, and geometry boxes',
          'Health, hygiene, and moral values workshops'
        ]
      }
    ];

    await query(
      `INSERT INTO site_content (section_key, content_json, updated_at)
       VALUES ('about_page', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (section_key) DO UPDATE SET content_json = EXCLUDED.content_json`,
      [JSON.stringify(aboutData)]
    );
    console.log('✔ Updated "about_page" with programs and images');
  }

  // 3. Gallery Page Banner
  const checkGallery = await query("SELECT section_key FROM site_content WHERE section_key = 'gallery_page'");
  if (checkGallery.rows.length === 0) {
    const galleryContent = {
      hero_title: 'Moments of Hope, Service & Smiles',
      hero_subtitle: 'A visual glimpse into our daily work: nurturing children, supporting elders, and transforming lives across Tamil Nadu.',
      hero_image_url: 'assets/images/Gallery_page_hero_section_desktop_view.jpeg'
    };
    await query(
      `INSERT INTO site_content (section_key, content_json, updated_at)
       VALUES ('gallery_page', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (section_key) DO UPDATE SET content_json = EXCLUDED.content_json`,
      [JSON.stringify(galleryContent)]
    );
    console.log('✔ Seeded "gallery_page" content');
  }

  // 4. Contact Page
  const checkContact = await query("SELECT section_key FROM site_content WHERE section_key = 'contact_page'");
  if (checkContact.rows.length === 0) {
    const contactContent = {
      hero_title: 'Get In Touch With Truth Foundation',
      hero_subtitle: 'We are here to answer your questions, schedule center visits, and guide your donation contributions.',
      hero_image_url: 'assets/images/contact_page_hero_background_image_desktop_view.jpg',
      redhills_name: 'Truth Foundation Home & Orphanage Campus',
      redhills_address: 'No. 12, Gandhi Nagar, Redhills, Chennai - 600052, Tamil Nadu, India',
      redhills_phone: '+91 63827 21178',
      redhills_email: 'truthfoundation2010@gmail.com',
      kolathur_name: 'Administrative & Corporate Office',
      kolathur_address: 'Old No. 12, New No. 28, 2nd Main Road, Thanikachalam Nagar, E-Block, Kolathur, Chennai - 600099, Tamil Nadu, India',
      kolathur_phone: '+91 99622 94949',
      kolathur_email: 'truthfoundation2010@gmail.com',
      whatsapp_number: '+916382721178',
      timings: 'Monday - Saturday: 9:00 AM - 7:00 PM'
    };
    await query(
      `INSERT INTO site_content (section_key, content_json, updated_at)
       VALUES ('contact_page', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (section_key) DO UPDATE SET content_json = EXCLUDED.content_json`,
      [JSON.stringify(contactContent)]
    );
    console.log('✔ Seeded "contact_page" content');
  }
}

async function seedDefaultGalleryImages() {
  const countRes = await query('SELECT COUNT(*) FROM gallery_images');
  if (parseInt(countRes.rows[0].count, 10) > 0) {
    console.log('ℹ Table "gallery_images" already has records');
    return;
  }

  console.log('⚡ Seeding initial gallery images...');

  const initialGallery = [
    {
      title: 'Nutritious Meal Serving for Children',
      category: 'Meals',
      image_url: 'assets/images/img56.jpeg',
      description: 'Providing wholesome, balanced, and freshly prepared hot meals to resident and visiting children.'
    },
    {
      title: 'Daily Freshly Cooked Nourishment',
      category: 'Meals',
      image_url: 'assets/images/img101.jpeg',
      description: 'Freshly prepared, hygienic food served with warmth and love to every child in our care.'
    },
    {
      title: 'Wholesome Community Food Distribution',
      category: 'Meals',
      image_url: 'assets/images/img137.jpeg',
      description: 'Community meal drives providing healthy food support to children and seniors in surrounding settlements.'
    },
    {
      title: 'Evening Tuition & Homework Guidance',
      category: 'Education',
      image_url: 'assets/images/img170.jpeg',
      description: 'Dedicated volunteer educators assisting children with homework, school subjects, and exam preparation.'
    },
    {
      title: 'Interactive Learning & Study Hours',
      category: 'Education',
      image_url: 'assets/images/img179.jpeg',
      description: 'Interactive classroom learning, reading sessions, and concept building for tuition students.'
    },
    {
      title: 'Joyful Birthday Celebration with Children',
      category: 'Birthday Celebrations',
      image_url: 'assets/images/img188.jpeg',
      description: 'Celebrating special birthdays with cakes, festive sweets, and heartwarming smiles for the children.'
    },
    {
      title: 'Birthday Moments & Sweet Memories',
      category: 'Birthday Celebrations',
      image_url: 'assets/images/img236.jpeg',
      description: 'Sharing birthday happiness, festive cakes, and joyful cheers with all resident children.'
    },
    {
      title: 'Dedicated Volunteers in Action',
      category: 'Volunteers',
      image_url: 'assets/images/img212.jpeg',
      description: 'Passionate volunteers dedicating their time and effort to support teaching, games, and care activities.'
    },
    {
      title: 'Rural Health & Nutrition Camp',
      category: 'Medical',
      image_url: 'assets/images/img293.jpg',
      description: 'Comprehensive health checkups, vitals monitoring, and pediatric health screening in rural communities.'
    },
    {
      title: 'Special Care & Recreational Activities',
      category: 'Events',
      image_url: 'assets/images/img299.jpg',
      description: 'Recreational games, sports events, and festive bonding moments across our campuses.'
    }
  ];

  for (let i = 0; i < initialGallery.length; i++) {
    const item = initialGallery[i];
    await query(
      `INSERT INTO gallery_images (title, category, image_url, description, display_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [item.title, item.category, item.image_url, item.description, i]
    );
  }

  console.log(`✔ Seeded ${initialGallery.length} default gallery images`);
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

