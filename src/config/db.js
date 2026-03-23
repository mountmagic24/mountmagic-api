const mongoose = require("mongoose");

const connectDB = async (URI) => {
  try {
    const conn = await mongoose.connect(URI);

    console.log(`MongoDB Connected`);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
