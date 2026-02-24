import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Multer memory storage to process with sharp
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Sadece JPEG/PNG/WebP dosyalarına izin verilir'), false);
  }
});

// Ensure uploads/products folder exists
// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'products');
// Normalize and ensure directory exists
const normalizedUploadsDir = path.resolve(UPLOADS_DIR);
fs.mkdirSync(normalizedUploadsDir, { recursive: true });
console.log('Uploads directory ensured at:', normalizedUploadsDir);

// Middleware to process uploaded file (sharp conversion) - expects multer to have populated req.file
export const processProductImage = async (req, res, next) => {
  console.log('Multer req.file:', req.file);
  if (!req.file) return next();

  try {
    const timestamp = Date.now();
    const rand = Math.floor(Math.random() * 1e9);
    const filename = `${timestamp}-${rand}.webp`;
    // physical path where file will be written on disk
    const physicalPath = path.join(normalizedUploadsDir, filename);
    console.log('Sharp will write file to (physical):', physicalPath);

    // Convert and optimize with sharp -> write to physicalPath
    await sharp(req.file.buffer)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(physicalPath);

    // public URL path to store in DB and send to clients
    req.customImageUrl = `/api/uploads/products/${filename}`;
    console.log('File processed and saved, req.customImageUrl set to', req.customImageUrl);
    next();
  } catch (e) {
    console.error('Sharp processing error:', e);
    next(e);
  }
};

export default {
  upload,
  processProductImage,
};

