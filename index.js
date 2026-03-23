const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;

app = express();
// Add root route
app.get("/", (req, res) => {
  res.json({
    message: "Mount Magic API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});
connectDB(dbURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Database connection failed: ${err}`);
  });
