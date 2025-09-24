const express = require("express");
const router = express.Router();
const { register, login, verify } = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", upload.single("profile_image"), register);
router.post("/login", login);
router.get("/verify", verify);

module.exports = router;
