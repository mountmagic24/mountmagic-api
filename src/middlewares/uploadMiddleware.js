const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create temp uploads directory if it doesn't exist
const tempUploadDir = path.join(__dirname, "../../temp-uploads");
if (!fs.existsSync(tempUploadDir)) {
  fs.mkdirSync(tempUploadDir, { recursive: true });
}

/**
 * Configure multer storage for temporary file uploads
 * Files are stored temporarily and deleted after successful Cloudinary upload
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempUploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + original name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

/**
 * File filter: Allow common image and document formats
 */
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and document files are allowed (jpeg, png, gif, webp, pdf, doc, docx, txt)"), false);
  }
};

/**
 * Multer upload middleware
 * Limits: max 5MB per file, max 1 file per request
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
