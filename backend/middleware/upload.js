const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads/thumbnails', 'uploads/videos', 'uploads/pdfs'];
uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Configure Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails');
    } else if (file.fieldname === 'video') {
      cb(null, 'uploads/videos');
    } else if (file.fieldname === 'pdf' || file.fieldname === 'submission') {
      cb(null, 'uploads/pdfs');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File validation
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'thumbnail') {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Please upload an image file'), false);
  } else if (file.fieldname === 'video') {
    if (file.mimetype.startsWith('video/')) cb(null, true);
    else cb(new Error('Please upload a video file'), false);
  } else if (file.fieldname === 'pdf' || file.fieldname === 'submission') {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Please upload a PDF document'), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
  fileFilter: fileFilter
});

module.exports = upload;
