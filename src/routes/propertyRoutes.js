const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

// debug log
console.log("[propertyRoutes] Loaded");

// create a property
router.post(
  "/properties",
  authMiddleware,
  upload.array("images", 10), // Accept up to 10 images
  propertyController.createProperty
);

// get all properties 
router.get("/properties", propertyController.getProperties);

// get properties of the logged-in user
router.get("/properties/my-properties", authMiddleware, propertyController.getUserProperties);

// get property by id
router.get("/properties/:id", propertyController.getPropertyById);



module.exports = router;

