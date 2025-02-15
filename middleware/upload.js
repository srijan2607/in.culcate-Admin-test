// middleware/upload.js

const multer = require("multer");
const { BadRequestError } = require("../errors");

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Only image files are allowed!"), false);
  }
};

// Configure upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (Cloudflare's limit)
  },
});

module.exports = {
  uploadImages: upload.fields([
    { name: "Short_image", maxCount: 1 },
    { name: "Long_image", maxCount: 1 },
  ]),
};
