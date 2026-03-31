const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

router.get("/", getServices);
router.post("/", protect, createService);
router.get("/:id", getServiceById);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;
