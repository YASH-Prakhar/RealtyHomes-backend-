const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // Allow cookies and auth headers if needed
};

module.exports = cors(corsOptions);
