const multer = require("multer");

// Middleware for handling file uploads using memory storage

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload.single("image");
