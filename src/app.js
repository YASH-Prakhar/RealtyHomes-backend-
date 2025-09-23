require('dotenv').config();
const express = require("express");
const sequelize = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const corsMiddleware = require("./middlewares/corsMiddleware");
const app = express();
app.use(express.json());

app.use(corsMiddleware);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

sequelize.sync().then(() => {
  console.log("Database synced");
});

// add listener
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});

module.exports = app;
