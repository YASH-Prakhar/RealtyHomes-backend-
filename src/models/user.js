const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
// const Property = require("../models/properties");

const User = sequelize.define("User", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: DataTypes.STRING,
  role: { type: DataTypes.ENUM("user", "broker"), defaultValue: "user" },
  agency_name: DataTypes.STRING,
  license_number: DataTypes.STRING,
  bio: DataTypes.TEXT,
  profile_image: DataTypes.STRING,
});


// User.hasMany(Property, { foreignKey: "owner_id" });

module.exports = User;
