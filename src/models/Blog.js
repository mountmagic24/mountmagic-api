const mongoose = require("mongoose");
const cloudinaryService = require("../services/cloudinaryService");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Image storage from Cloudinary
    imageUrl: {
      type: String,
      default: null,
    },
    imagePublicId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

/**
 * Pre-delete hook: Delete associated image from Cloudinary when blog is deleted
 * Uses async function pattern which automatically handles promise resolution
 */
blogSchema.pre("deleteOne", { document: true }, async function () {
  try {
    // If blog has an image, delete it from Cloudinary
    if (this.imagePublicId) {
      await cloudinaryService.deleteImage(this.imagePublicId);
    }
  } catch (error) {
    // Log error but don't block deletion
    console.error("Error deleting image from Cloudinary:", error.message);
  }
});

module.exports = mongoose.model("Blog", blogSchema);
