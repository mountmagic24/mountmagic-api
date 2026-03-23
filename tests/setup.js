const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.test" });

beforeAll(async () => {
  const uri = process.env.MONGO_URI;

  await mongoose.connect(uri);
}, 20000); // atlas needs longer sometimes

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
