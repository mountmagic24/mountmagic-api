require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/User");
const Blog = require("./src/models/Blog");
const Service = require("./src/models/Service");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO;

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Blog.deleteMany({});
    await Service.deleteMany({});
    console.log("Cleared existing data");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@mountmagic.com",
      password: hashedPassword,
      role: "admin",
    });

    const contentManager = await User.create({
      name: "Content Manager",
      email: "content@mountmagic.com",
      password: hashedPassword,
      role: "content_manager",
    });

    const regularUser = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "user",
    });

    console.log("Created users");

    const blogs = await Blog.insertMany([
      {
        title: "Top 10 Mountain Treks in Nepal",
        content: "Nepal is home to some of the world's most breathtaking mountain treks. From the iconic Everest Base Camp to the serene Annapurna Circuit, there's something for every level of hiker. The trails offer stunning views of snow-capped peaks, ancient monasteries, and vibrant local cultures. Whether you're a beginner or an experienced mountaineer, Nepal's trekking routes promise unforgettable adventures.",
        author: contentManager._id,
      },
      {
        title: "Best Time to Visit the Mountains",
        content: "Planning a mountain getaway? The best time to visit depends on what you want to experience. Spring (March-May) brings colorful rhododendron blooms and mild weather. Autumn (September-November) offers clear skies and perfect visibility for mountain views. Winter provides a magical snowy landscape but requires proper preparation. Each season has its unique charm!",
        author: contentManager._id,
      },
      {
        title: "Mountain Safety Tips",
        content: "Safety should always be your top priority when exploring mountainous terrain. Always check weather conditions before heading out, carry essential gear including first aid supplies, stay hydrated, and never venture alone into remote areas. It's also important to respect local guidelines and hire experienced guides for challenging routes. Remember, the mountains will always be there - there's no need to take unnecessary risks.",
        author: adminUser._id,
      },
      {
        title: "Local Culture and Traditions",
        content: "The mountain regions are rich in unique cultural traditions. Local communities have preserved their ancestral ways of life for generations. From colorful festivals to traditional cuisine, experiencing the local culture adds depth to your mountain adventure. Take time to interact with locals, learn about their customs, and support community-based tourism initiatives.",
        author: contentManager._id,
      },
      {
        title: "Photography Tips for Mountain Landscapes",
        content: "Capturing the beauty of mountain landscapes requires both skill and patience. Early morning and late afternoon light offer the best conditions for dramatic shots. Always carry a tripod for long exposures and consider using polarizing filters to enhance cloud contrast. Don't forget to capture the small details - wildflowers, local wildlife, and the textures of rocky terrain.",
        author: regularUser._id,
      },
    ]);

    console.log("Created blogs");

    const services = await Service.insertMany([
      {
        title: "Guided Trekking Package",
        description: "Complete guided trekking experience including expert guides, accommodation, meals, and permits. Perfect for those who want a hassle-free adventure in the mountains.",
        price: 1500,
        category: "Trekking",
        createdBy: adminUser._id,
      },
      {
        title: "Mountaineering Course",
        description: "Professional mountaineering training covering climbing techniques, safety procedures, and equipment usage. Ideal for beginners wanting to learn proper climbing skills.",
        price: 2500,
        category: "Training",
        createdBy: adminUser._id,
      },
      {
        title: "Photography Expedition",
        description: "Specialized photography tour with expert guidance on capturing mountain landscapes. Includes sunrise shoots, location scouting, and post-processing tips.",
        price: 1200,
        category: "Photography",
        createdBy: contentManager._id,
      },
      {
        title: "Cultural Village Tour",
        description: "Explore ancient mountain villages, experience local traditions, and enjoy authentic cuisine. A perfect blend of adventure and cultural immersion.",
        price: 800,
        category: "Tour",
        createdBy: contentManager._id,
      },
      {
        title: "Equipment Rental",
        description: "High-quality hiking and camping equipment available for rent. Includes tents, sleeping bags, trekking poles, and safety gear.",
        price: 200,
        category: "Rental",
        createdBy: regularUser._id,
      },
      {
        title: "Airport Transfer Service",
        description: "Reliable transportation from airport to your mountain destination. Professional drivers comfortable vehicles available for groups of any size.",
        price: 150,
        category: "Transport",
        createdBy: adminUser._id,
      },
    ]);

    console.log("Created services");

    console.log("\n--- Seed Complete ---");
    console.log("\nTest Accounts:");
    console.log("Admin: admin@mountmagic.com / password123");
    console.log("Content Manager: content@mountmagic.com / password123");
    console.log("User: john@example.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();