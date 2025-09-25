const Inquiry = require("../models/inquires");
const Property = require("../models/properties");

exports.createInquiry = async (req, res) => {
  console.log("[CREATE INQUIRY] Endpoint hit");
  try {
    const { name, email, phone, message, property_id, owner_id } = req.body;

    if (!name || !email || !message || !property_id || !owner_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Optionally, get sender_id from auth middleware if logged in
    let sender_id = null;
    if (req.user && req.user.id) {
      sender_id = req.user.id;
    }

    // Validate property exists
    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      property_id,
      sender_id,
      receiver_id: owner_id,
      name,
      email,
      phone,
      message,
    });

    console.log("[CREATE INQUIRY] Inquiry created:", inquiry.id);
    res.status(201).json({ message: "Inquiry sent successfully", inquiry });
  } catch (err) {
    console.error("[CREATE INQUIRY] Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserInquiries = async (req, res) => {
  console.log("[GET USER INQUIRIES] Endpoint hit");
  try {
    const userId = req.query.user_id || (req.user && req.user.id);
    if (!userId) {
      return res.status(400).json({ message: "Missing user_id" });
    }
    const inquiries = await Inquiry.findAll({
      where: { receiver_id: userId },
      order: [["created_at", "DESC"]],
    });
    console.log(`[GET USER INQUIRIES] Found ${inquiries.length} inquiries for user ${userId}`);
    res.json({ inquiries });
  } catch (err) {
    console.error("[GET USER INQUIRIES] Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};