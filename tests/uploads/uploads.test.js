/**
 * Blog Image Functions Tests
 * Tests for uploadBlogImage and deleteBlogImage controller functions
 */

const {
  uploadBlogImage,
  deleteBlogImage,
} = require("../../src/controllers/blogController");
const Blog = require("../../src/models/Blog");
const cloudinaryService = require("../../src/services/cloudinaryService");

jest.mock("../../src/services/cloudinaryService");

describe("Blog Image Controller Functions", () => {
  let mockReq, mockRes, mockNext;
  let blogId;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Create a test blog
    const blog = await Blog.create({
      title: "Test Blog",
      content: "Test Content",
    });
    blogId = blog._id.toString();

    // Setup mock request/response
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockReq = {
      params: { id: blogId },
      file: { path: "/tmp/test.jpg" },
    };
    mockNext = jest.fn();
  });

  describe("uploadBlogImage", () => {
    it("should successfully upload and save blog image", async () => {
      cloudinaryService.uploadImage.mockResolvedValue({
        url: "https://res.cloudinary.com/blog.jpg",
        public_id: `blogs/${blogId}/image`,
      });
      cloudinaryService.removeLocalFile.mockImplementation(() => {});

      await uploadBlogImage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            blog: expect.any(Object),
          }),
        })
      );

      // Verify blog was updated
      const updatedBlog = await Blog.findById(blogId);
      expect(updatedBlog.imageUrl).toBe("https://res.cloudinary.com/blog.jpg");
      expect(updatedBlog.imagePublicId).toBe(`blogs/${blogId}/image`);
    });

    it("should return 404 if blog not found", async () => {
      const fakeBlogId = "999999999999999999999999";
      mockReq.params.id = fakeBlogId;

      await uploadBlogImage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Blog not found",
        })
      );
    });

    it("should return 400 if no file uploaded", async () => {
      mockReq.file = null;

      await uploadBlogImage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "No file uploaded",
        })
      );
    });

    it("should delete old image when uploading new one", async () => {
      // Set initial image
      const blog = await Blog.findById(blogId);
      blog.imageUrl = "https://old-image.jpg";
      blog.imagePublicId = "old-public-id";
      await blog.save();

      cloudinaryService.uploadImage.mockResolvedValue({
        url: "https://new-image.jpg",
        public_id: "new-public-id",
      });
      cloudinaryService.removeLocalFile.mockImplementation(() => {});

      await uploadBlogImage(mockReq, mockRes);

      expect(cloudinaryService.deleteImage).toHaveBeenCalledWith(
        "old-public-id"
      );
    });

    it("should handle upload errors gracefully", async () => {
      cloudinaryService.uploadImage.mockRejectedValue(
        new Error("Upload failed")
      );
      cloudinaryService.removeLocalFile.mockImplementation(() => {});

      await uploadBlogImage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });
  });

  describe("deleteBlogImage", () => {
    it("should successfully delete blog image", async () => {
      // Set image on blog
      const blog = await Blog.findById(blogId);
      blog.imageUrl = "https://image.jpg";
      blog.imagePublicId = "blogs/123/image";
      await blog.save();

      cloudinaryService.deleteImage.mockResolvedValue({
        success: true,
        message: "Image deleted successfully",
      });

      await deleteBlogImage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );

      // Verify image fields cleared
      const updatedBlog = await Blog.findById(blogId);
      expect(updatedBlog.imageUrl).toBeNull();
      expect(updatedBlog.imagePublicId).toBeNull();
    });

    it("should return 404 if blog not found", async () => {
      const fakeBlogId = "999999999999999999999999";
      mockReq.params.id = fakeBlogId;

      await deleteBlogImage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Blog not found",
        })
      );
    });

    it("should return 400 if blog has no image", async () => {
      await deleteBlogImage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Blog has no image",
        })
      );
    });

    it("should handle deletion errors gracefully", async () => {
      // Set image on blog
      const blog = await Blog.findById(blogId);
      blog.imageUrl = "https://image.jpg";
      blog.imagePublicId = "blogs/123/image";
      await blog.save();

      cloudinaryService.deleteImage.mockRejectedValue(
        new Error("Deletion failed")
      );

      await deleteBlogImage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });
  });
});
