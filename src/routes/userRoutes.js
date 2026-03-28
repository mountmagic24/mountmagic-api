const express = require("express");
const route = express.Router();

const protect = require("../middlewares/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/userController");

route.get("/profile", protect, getProfile);
route.put("/profile", protect, updateProfile);

module.exports = route;
