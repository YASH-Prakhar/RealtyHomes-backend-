const express = require("express");
const router = express.Router();
const inquiryController = require("../controllers/inquiryController");
const authMiddleware = require("../middlewares/authMiddleware");

// Anyone can send an inquiry (auth optional)
router.post("/inquiries", authMiddleware, inquiryController.createInquiry);

// Get inquiries of the logged-in user
router.get("/inquiries/my-inquiries", authMiddleware, inquiryController.getUserInquiries);

module.exports = router;
