import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import { initDatabase } from './db/init.js';
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend and admin dashboard
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Dev-friendly permissive CORS
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get(['/', '/api/health', '/health'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Truth Foundation API Server',
    database: 'Supabase PostgreSQL',
    storage: 'Cloudinary',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/content', contentRoutes);

// Error Handling Middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Truth Foundation Backend Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database on startup:', error);
    // Still start server so developer can see API error
    app.listen(PORT, () => {
      console.log(`⚠️ Backend Server running with DB warnings on http://localhost:${PORT}`);
    });
  }
}

startServer();
