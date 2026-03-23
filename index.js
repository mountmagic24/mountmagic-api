const express = require("express");
PORT = 5000;

const { connectDB } = require("./config/db");

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
