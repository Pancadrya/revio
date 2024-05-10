import multer from 'multer';
import path from 'path';

// Set up disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/raawwrrrrr/'); // Destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    // Use original file name for the uploaded file
    cb(null, file.originalname);
  },
});

// Configure multer for file upload using disk storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // File size limit (e.g., 10 MB)
});

// Middleware for uploading images
export const imageUploadMiddleware = upload.single('image');

// Middleware for uploading audio files
export const audioUploadMiddleware = upload.single('audio');
