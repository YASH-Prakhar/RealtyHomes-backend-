const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", upload.single("profile_image"), register);
router.post("/login", login);

module.exports = router;
