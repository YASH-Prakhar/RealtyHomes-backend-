const Property = require("../models/properties");
const cloudinary = require("../utils/cloudinary");

exports.createProperty = async (req, res) => {
  console.log("[CREATE PROPERTY] Endpoint hit");
  try {
    const {
      title,
      description,
      price,
      location,
      property_type,
      bedrooms,
      bathrooms,
      area_sqft,
      features,
    } = req.body;

    console.log("[CREATE PROPERTY] Request body:", req.body);

    // Parse features if sent as a string (from form-data)
    let featuresArr = features;
    if (typeof features === "string") {
      featuresArr = JSON.parse(features);
    }

    // Upload images to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      console.log(
        `[CREATE PROPERTY] Uploading ${req.files.length} images to Cloudinary`
      );
      for (const file of req.files) {
        const url = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "realtyhomes/properties" },
            (error, result) => {
              if (error) {
                console.error(
                  "[CREATE PROPERTY] Cloudinary upload error:",
                  error
                );
                return reject(error);
              }
              resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
        imageUrls.push(url);
      }
      console.log("[CREATE PROPERTY] Uploaded image URLs:", imageUrls);
    }

    // Assume owner_id is set from auth middleware (req.user.id)
    const owner_id = req.user.id;
    console.log("[CREATE PROPERTY] Owner ID:", owner_id);

    const property = await Property.create({
      owner_id,
      title,
      description,
      price,
      location,
      property_type,
      bedrooms,
      bathrooms,
      area_sqft,
      images: imageUrls,
      features: featuresArr,
    });

    console.log("[CREATE PROPERTY] Property created:", property.id);

    res.status(201).json({ message: "Property created", property });
  } catch (err) {
    console.error("[CREATE PROPERTY] Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  console.log("[GET PROPERTY] Endpoint hit");
  try {
    const propertyId = req.params.id;
    console.log("[GET PROPERTY] Property ID:", propertyId);

    // Include owner (User) and get only the name
    const property = await Property.findByPk(propertyId, {
      include: [
        { model: require("../models/user"), as: "owner", attributes: ["name"] },
      ],
    });

    if (!property) {
      console.log("[GET PROPERTY] Property not found:", propertyId);
      return res.status(404).json({ message: "Property not found" });
    }

    // Add owner_name to the response
    const propertyData = property.toJSON();
    propertyData.owner_name = property.owner ? property.owner.name : null;

    console.log(
      "[GET PROPERTY] Property found:",
      property.id,
      "Owner:",
      propertyData.owner_name
    );
    res.json({ property: propertyData });
  } catch (err) {
    console.error("[GET PROPERTY] Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getProperties = async (req, res) => {
  console.log("[GET PROPERTIES] Endpoint hit");
  try {
    const properties = await Property.findAll();
    console.log(`[GET PROPERTIES] Found ${properties.length} properties`);
    res.json({ properties });
  } catch (err) {
    console.error("[GET PROPERTIES] Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserProperties = async (req, res) => {
  console.log("[GET USER PROPERTIES] Endpoint hit");
  try {
    const userId = req.query.user_id || (req.user && req.user.id);
    if (!userId) {
      return res.status(400).json({ message: "Missing user_id" });
    }
    const properties = await Property.findAll({
      where: { owner_id: userId },
      order: [["created_at", "DESC"]],
    });
    console.log(`[GET USER PROPERTIES] Found ${properties.length} properties for user ${userId}`);
    res.json({ properties });
  } catch (err) {
    console.error("[GET USER PROPERTIES] Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};