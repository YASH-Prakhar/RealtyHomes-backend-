const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Inquiry = sequelize.define(
  "Inquiry",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "properties",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: true, 
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: DataTypes.STRING,
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("new", "read", "replied"),
      defaultValue: "new",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "inquiries",
    timestamps: false,
  }
);

module.exports = Inquiry;
