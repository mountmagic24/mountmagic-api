const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const protect = require("../middlewares/authMiddleware");
const cloudinaryService = require("../services/cloudinaryService");
const { uploadBlogImage, deleteBlogImage } = require("../controllers/blogController");

/**
 * POST /api/uploads/blog/:id/image
 * Upload image for a blog post
 * Requires: Authentication, image file in multipart/form-data
 */
router.post("/blog/:id/image", protect, upload.single("image"), uploadBlogImage);

/**
 * DELETE /api/uploads/blog/:id/image
 * Delete image from a blog post
 * Requires: Authentication
 */
router.delete("/blog/:id/image", protect, deleteBlogImage);

/**
 * POST /api/uploads/cs
 * Upload files for CS-related operations (documents, etc.)
 * Returns: { url, public_id } for later deletion
 * Requires: Authentication, file in multipart/form-data
 */
router.post("/cs", protect, upload.single("file"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    try {
      // Upload to Cloudinary in cs_uploads folder
      const imageData = await cloudinaryService.uploadImage(
        req.file.path,
        "cs_uploads"
      );

      // Delete temporary file
      cloudinaryService.removeLocalFile(req.file.path);

      return res.status(200).json({
        success: true,
        data: {
          url: imageData.url,
          public_id: imageData.public_id,
        },
      });
    } catch (uploadError) {
      // Clean up temp file on error
      if (req.file) {
        cloudinaryService.removeLocalFile(req.file.path);
      }
      throw uploadError;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "File upload failed",
    });
  }
});

/**
 * DELETE /api/uploads/:public_id
 * Delete any image from Cloudinary using its public_id
 * Can be used to delete CS uploads or other images
 * Requires: Authentication
 */
router.delete("/:public_id", protect, async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({ success: false, message: "public_id required" });
    }

    // Delete from Cloudinary
    const result = await cloudinaryService.deleteImage(public_id);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Image deletion failed",
    });
  }
});

module.exports = router;
