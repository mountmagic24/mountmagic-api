/**
 * Cloudinary Service Unit Tests
 * Tests for upload, delete, and file cleanup functions
 */

const cloudinaryService = require("../../src/services/cloudinaryService");

// Mock the cloudinary module completely
jest.mock("../../src/config/cloudinary", () => ({
  uploader: {
    upload: jest.fn(),
    destroy: jest.fn(),
  },
}));

// Mock fs module
jest.mock("fs");

const cloudinary = require("../../src/config/cloudinary");
const fs = require("fs");

describe("Cloudinary Service - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadImage", () => {
    it("should successfully upload image and return url and public_id", async () => {
      const mockResponse = {
        secure_url: "https://res.cloudinary.com/test/image/upload/v1234/blog.jpg",
        public_id: "blogs/123/image",
      };

      cloudinary.uploader.upload.mockResolvedValue(mockResponse);

      const result = await cloudinaryService.uploadImage(
        "/tmp/test.jpg",
        "blogs/123"
      );

      expect(result).toEqual({
        url: "https://res.cloudinary.com/test/image/upload/v1234/blog.jpg",
        public_id: "blogs/123/image",
      });
      
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
        "/tmp/test.jpg",
        expect.objectContaining({
          folder: "blogs/123",
          transformation: [{ f_auto: "true", q_auto: "true" }],
        })
      );
    });

    it("should throw error on upload failure", async () => {
      cloudinary.uploader.upload.mockRejectedValue(
        new Error("Upload failed")
      );

      await expect(
        cloudinaryService.uploadImage("/tmp/test.jpg", "blogs/123")
      ).rejects.toThrow("Cloudinary upload failed");
    });

    it("should call uploadImage with correct folder parameter", async () => {
      cloudinary.uploader.upload.mockResolvedValue({
        secure_url: "https://example.com/image.jpg",
        public_id: "cs_uploads/doc",
      });

      await cloudinaryService.uploadImage("/tmp/doc.pdf", "cs_uploads");

      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
        "/tmp/doc.pdf",
        expect.objectContaining({
          folder: "cs_uploads",
        })
      );
    });
  });

  describe("deleteImage", () => {
    it("should successfully delete image when it exists", async () => {
      cloudinary.uploader.destroy.mockResolvedValue({ result: "ok" });

      const result = await cloudinaryService.deleteImage("blogs/123/image");

      expect(result).toEqual({
        success: true,
        message: "Image deleted successfully",
      });
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        "blogs/123/image"
      );
    });

    it("should return not found if image doesn't exist", async () => {
      cloudinary.uploader.destroy.mockResolvedValue({ result: "not_found" });

      const result = await cloudinaryService.deleteImage("blogs/123/image");

      expect(result).toEqual({
        success: false,
        message: "Image not found or already deleted",
      });
    });

    it("should throw error on delete failure", async () => {
      cloudinary.uploader.destroy.mockRejectedValue(
        new Error("Delete failed")
      );

      await expect(
        cloudinaryService.deleteImage("blogs/123/image")
      ).rejects.toThrow("Cloudinary deletion failed");
    });
  });

  describe("removeLocalFile", () => {
    it("should remove file if it exists", () => {
      const testFile = "/tmp/test-file.jpg";
      fs.existsSync.mockReturnValue(true);

      cloudinaryService.removeLocalFile(testFile);

      expect(fs.existsSync).toHaveBeenCalledWith(testFile);
      expect(fs.unlinkSync).toHaveBeenCalledWith(testFile);
    });

    it("should not attempt to remove file if it doesn't exist", () => {
      const testFile = "/tmp/nonexistent.jpg";
      fs.existsSync.mockReturnValue(false);

      cloudinaryService.removeLocalFile(testFile);

      expect(fs.existsSync).toHaveBeenCalledWith(testFile);
      expect(fs.unlinkSync).not.toHaveBeenCalled();
    });

    it("should silently handle file not found", () => {
      const testFile = "/tmp/missing.jpg";
      fs.existsSync.mockReturnValue(false);

      expect(() => {
        cloudinaryService.removeLocalFile(testFile);
      }).not.toThrow();
    });
  });
});
