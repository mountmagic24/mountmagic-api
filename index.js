const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
const dbURI = process.env.MONGO_URI;

app = express();

connectDB(dbURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Database connection failed: ${err}`);
  });
