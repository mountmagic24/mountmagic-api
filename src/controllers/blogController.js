const mongoose = require("mongoose");
const Blog = require("../models/Blog");

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

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
