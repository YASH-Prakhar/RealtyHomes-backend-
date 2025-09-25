const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
// const User = require("../models/user");

const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    property_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    bedrooms: DataTypes.INTEGER,
    bathrooms: DataTypes.INTEGER,
    area_sqft: DataTypes.INTEGER,
    images: {
      type: DataTypes.JSON, // Store array of image URLs as JSON
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "pending", "sold"),
      defaultValue: "active",
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    features: {
      type: DataTypes.JSON, // Store array of features as JSON
      allowNull: true,
    },
  },
  {
    tableName: "properties",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// After defining Property
// Property.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

module.exports = Property;
