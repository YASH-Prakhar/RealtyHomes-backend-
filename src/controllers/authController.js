const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("../utils/jwt");
const { validateRegistration } = require("../utils/validate");
const { hashPassword } = require("../utils/hash");
const cloudinary = require("../utils/cloudinary");

exports.register = async (req, res) => {
  console.log("[REGISTER] Endpoint hit");
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      console.log("[REGISTER] Validation error:", error);
      return res.status(400).json({ message: error });
    }

    const existing = await User.findOne({ where: { email: req.body.email } });
    if (existing) {
      console.log("[REGISTER] Email already registered:", req.body.email);
      return res.status(409).json({ message: "Email already registered" });
    }

    let profileImageUrl = null;
    if (req.file) {
      console.log("[REGISTER] Uploading profile image to Cloudinary");
      try {
        profileImageUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "realtyhomes/profiles" },
            (error, result) => {
              if (error) {
                console.log("[REGISTER] Cloudinary upload error:", error);
                return reject(error);
              }
              resolve(result.secure_url);
            }
          );
          stream.end(req.file.buffer);
        });
        console.log(
          "[REGISTER] Cloudinary upload successful:",
          profileImageUrl
        );
      } catch (uploadErr) {
        console.log("[REGISTER] Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const hashedPassword = await hashPassword(req.body.password);

    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      role: req.body.role,
      agency_name: req.body.agency_name,
      license_number: req.body.license_number,
      bio: req.body.bio,
      profile_image: profileImageUrl,
    });

    console.log("[REGISTER] Registration successful for:", req.body.email);
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.log("[REGISTER] Server error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.login = async (req, res) => {
  console.log("[LOGIN] Endpoint hit");
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("[LOGIN] Missing email or password");
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("[LOGIN] Invalid credentials for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("[LOGIN] Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    console.log("[LOGIN] Login successful for:", email);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("[LOGIN] Server error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.verify = async (req, res) => {
  console.log("[VERIFY] Endpoint hit");
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("[VERIFY] No token provided");
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      console.log("[VERIFY] Invalid token for user id:", decoded.id);
      return res.status(401).json({ message: "Invalid token" });
    }
    console.log("[VERIFY] Token verified for user id:", decoded.id);
    res.json({ user });
  } catch (err) {
    console.log("[VERIFY] Invalid or expired token:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
