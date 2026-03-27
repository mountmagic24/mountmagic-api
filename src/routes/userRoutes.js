const express = require("express");
const route = express.Router();

const protect = require("../middlewares/authMiddleware");
const { getProfile } = require("../controllers/userController");

route.get("/profile", protect, getProfile);

module.exports = route;
