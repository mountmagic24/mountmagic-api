/**
 * Blog Model Tests
 * Tests for blog model with image functionality
 */

const Blog = require("../../src/models/Blog");
const cloudinaryService = require("../../src/services/cloudinaryService");

jest.mock("../../src/services/cloudinaryService");

describe("Blog Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Blog Schema - Image Fields", () => {
    it("should have imageUrl and imagePublicId fields", async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        content: "Test Content",
        imageUrl: "https://example.com/image.jpg",
        imagePublicId: "blogs/123/image",
      });

      expect(blog.imageUrl).toBe("https://example.com/image.jpg");
      expect(blog.imagePublicId).toBe("blogs/123/image");
    });

    it("should allow image fields to be null", async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        content: "Test Content",
      });

      expect(blog.imageUrl).toBeNull();
      expect(blog.imagePublicId).toBeNull();
    });

    it("should allow updating image fields", async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        content: "Test Content",
      });

      blog.imageUrl = "https://example.com/new-image.jpg";
      blog.imagePublicId = "blogs/456/image";
      await blog.save();

      const updatedBlog = await Blog.findById(blog._id);
      expect(updatedBlog.imageUrl).toBe("https://example.com/new-image.jpg");
      expect(updatedBlog.imagePublicId).toBe("blogs/456/image");
    });

    it("should allow clearing image fields", async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        content: "Test Content",
        imageUrl: "https://example.com/image.jpg",
        imagePublicId: "blogs/123/image",
      });

      blog.imageUrl = null;
      blog.imagePublicId = null;
      await blog.save();

      const updatedBlog = await Blog.findById(blog._id);
      expect(updatedBlog.imageUrl).toBeNull();
      expect(updatedBlog.imagePublicId).toBeNull();
    });

    it("should be able to update only imageUrl without imagePublicId", async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        content: "Test Content",
        imageUrl: "https://example.com/image.jpg",
      });

      expect(blog.imageUrl).toBe("https://example.com/image.jpg");
      expect(blog.imagePublicId).toBeNull();
    });
  });

  describe("Pre-delete Hook - Cloudinary Integration", () => {
    it("should call deleteImage when blog with image is deleted", async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        content: "Test Content",
        imageUrl: "https://example.com/image.jpg",
        imagePublicId: "blogs/123/image",
      });

      cloudinaryService.deleteImage.mockResolvedValue({
        success: true,
        message: "Image deleted successfully",
      });

      await blog.deleteOne();

      expect(cloudinaryService.deleteImage).toHaveBeenCalledWith(
        "blogs/123/image"
      );
    });

    it("should not call deleteImage if blog has no image", async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        content: "Test Content",
      });

      await blog.deleteOne();

      expect(cloudinaryService.deleteImage).not.toHaveBeenCalled();
    });

    it("should not block deletion if deleteImage fails", async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        content: "Test Content",
        imageUrl: "https://example.com/image.jpg",
        imagePublicId: "blogs/123/image",
      });

      cloudinaryService.deleteImage.mockRejectedValue(
        new Error("Cloudinary error")
      );

      // Should not throw error
      await expect(blog.deleteOne()).resolves.not.toThrow();

      // Blog should still be deleted
      const deletedBlog = await Blog.findById(blog._id);
      expect(deletedBlog).toBeNull();
    });

    it("should delete blog even if image already missing from Cloudinary", async () => {
      const blog = await Blog.create({
        title: "Test Blog",
        content: "Test Content",
        imageUrl: "https://example.com/image.jpg",
        imagePublicId: "blogs/123/image",
      });

      cloudinaryService.deleteImage.mockResolvedValue({
        success: false,
        message: "Image not found or already deleted",
      });

      await blog.deleteOne();

      // Blog should still be deleted
      const deletedBlog = await Blog.findById(blog._id);
      expect(deletedBlog).toBeNull();
    });
  });

  describe("Blog CRUD Operations", () => {
    it("should create blog with all fields", async () => {
      const blog = await Blog.create({
        title: "New Blog",
        content: "Blog content",
        imageUrl: "https://example.com/image.jpg",
        imagePublicId: "blogs/new/image",
      });

      expect(blog.title).toBe("New Blog");
      expect(blog.content).toBe("Blog content");
      expect(blog.imageUrl).toBe("https://example.com/image.jpg");
      expect(blog.imagePublicId).toBe("blogs/new/image");
    });

    it("should find blog by ID", async () => {
      const created = await Blog.create({
        title: "Find Me",
        content: "Content",
        imageUrl: "https://example.com/image.jpg",
      });

      const found = await Blog.findById(created._id);
      expect(found.title).toBe("Find Me");
      expect(found.imageUrl).toBe("https://example.com/image.jpg");
    });

    it("should update blog including image fields", async () => {
      const blog = await Blog.create({
        title: "Original",
        content: "Content",
      });

      blog.title = "Updated";
      blog.imageUrl = "https://example.com/new.jpg";
      blog.imagePublicId = "blogs/updated/image";
      await blog.save();

      const updated = await Blog.findById(blog._id);
      expect(updated.title).toBe("Updated");
      expect(updated.imageUrl).toBe("https://example.com/new.jpg");
      expect(updated.imagePublicId).toBe("blogs/updated/image");
    });
  });
});
