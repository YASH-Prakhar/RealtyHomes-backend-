const User = require("./user");
const Property = require("./properties");

User.hasMany(Property, { foreignKey: "owner_id" });
Property.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

module.exports = { User, Property };