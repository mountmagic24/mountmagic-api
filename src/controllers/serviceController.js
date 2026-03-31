const mongoose = require("mongoose");
const Service = require("../models/Service");

const createService = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Title and description required" });
    }

    const service = await Service.create({
      title,
      description,
      price,
      category,
      createdBy: req.user?.id,
    });

    return res.status(201).json({ success: true, data: { service } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getServices = async (_req, res) => {
  try {
    const services = await Service.find();
    return res.status(200).json({ success: true, data: { services } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    return res.status(200).json({ success: true, data: { service } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const { title, description, price, category } = req.body;

    if (title) service.title = title;
    if (description) service.description = description;
    if (price !== undefined) service.price = price;
    if (category) service.category = category;

    await service.save();

    return res.status(200).json({ success: true, data: { service } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    await service.deleteOne();

    return res.status(200).json({ success: true, message: "Service deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
