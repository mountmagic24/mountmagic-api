const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const cloudinaryService = require("../services/cloudinaryService");

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content required" });
    }

    const blog = await Blog.create({
      title,
      content,
      author: req.user?.id,
    });

    return res.status(201).json({ success: true, data: { blog } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find();
    return res.status(200).json({ success: true, data: { blogs } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    return res.status(200).json({ success: true, data: { blog } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const { title, content } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;

    await blog.save();

    return res.status(200).json({ success: true, data: { blog } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await blog.deleteOne();

    return res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Upload image to blog
 * POSTed file is temporarily saved, then uploaded to Cloudinary
 * Temporary file is deleted after successful upload
 */
const uploadBlogImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate blog ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      if (req.file) {
        cloudinaryService.removeLocalFile(req.file.path);
      }
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Find blog
    const blog = await Blog.findById(id);
    if (!blog) {
      if (req.file) {
        cloudinaryService.removeLocalFile(req.file.path);
      }
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    try {
      // Upload to Cloudinary in blogs/{blogId} folder
      const imageData = await cloudinaryService.uploadImage(
        req.file.path,
        `blogs/${id}`
      );

      // Delete old image from Cloudinary if it exists
      if (blog.imagePublicId) {
        await cloudinaryService.deleteImage(blog.imagePublicId);
      }

      // Update blog with new image
      blog.imageUrl = imageData.url;
      blog.imagePublicId = imageData.public_id;
      await blog.save();

      // Delete temporary file
      cloudinaryService.removeLocalFile(req.file.path);

      return res.status(200).json({
        success: true,
        data: {
          blog,
          message: "Image uploaded successfully",
        },
      });
    } catch (uploadError) {
      // Clean up temp file on upload error
      if (req.file) {
        cloudinaryService.removeLocalFile(req.file.path);
      }
      throw uploadError;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
};

/**
 * Delete image from blog
 * Removes image from Cloudinary and clears image fields from blog
 */
const deleteBlogImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate blog ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Find blog
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // Check if blog has an image
    if (!blog.imagePublicId) {
      return res.status(400).json({ success: false, message: "Blog has no image" });
    }

    try {
      // Delete from Cloudinary
      await cloudinaryService.deleteImage(blog.imagePublicId);

      // Remove image fields from blog
      blog.imageUrl = null;
      blog.imagePublicId = null;
      await blog.save();

      return res.status(200).json({
        success: true,
        data: { blog },
        message: "Image deleted successfully",
      });
    } catch (deleteError) {
      throw deleteError;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Image deletion failed",
    });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
  deleteBlogImage,
};
