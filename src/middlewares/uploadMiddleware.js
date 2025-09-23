const multer = require("multer");

const storage = multer.memoryStorage(); // We'll upload to Cloudinary from memory
const upload = multer({ storage });

module.exports = upload;
