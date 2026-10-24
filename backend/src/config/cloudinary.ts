import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'xsuj7lkd',
  api_key: process.env.CLOUDINARY_API_KEY || '915673299191652',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'G90ASaU4HCZU4fROLfI2cXHMSAI',
  secure: true
});

export default cloudinary;
