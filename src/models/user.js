const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const User = sequelize.define("User", {
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

module.exports = User;
