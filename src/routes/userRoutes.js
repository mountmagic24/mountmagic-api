const express = require("express");
const route = express.Router();

const protect = require("../middlewares/authMiddleware");
const { getProfile, getCurrentUser } = require("../controllers/userController");

route.get("/profile", protect, getProfile);
route.get("/me", protect, getCurrentUser);

module.exports = route;
