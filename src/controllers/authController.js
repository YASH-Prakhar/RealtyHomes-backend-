const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { validateRegistration } = require("../utils/validate");
const { hashPassword } = require("../utils/hash");
const cloudinary = require("../utils/cloudinary");

exports.register = async (req, res) => {
  try {
    const { error } = validateRegistration(req.body);
    if (error) return res.status(400).json({ message: error });

    const existing = await User.findOne({ where: { email: req.body.email } });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    let profileImageUrl = null;
    if (req.file) {
      // Properly await the upload and get the URL
      profileImageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "realtyhomes/profiles" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
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

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

exports.verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};