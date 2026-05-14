const cloudinary = require("../config/cloudinary");
const fs = require("fs");

/**
 * Upload image to Cloudinary with automatic optimization
 * @param {string} filePath - Path to the file to upload
 * @param {string} folderName - Cloudinary folder to store the image (e.g., "blogs/blogId")
 * @returns {Promise<{url: string, public_id: string}>} Image URL and public ID
 * @throws {Error} If upload fails
 */
const uploadImage = async (filePath, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      // Automatic format and quality optimization
      transformation: [{ f_auto: "true", q_auto: "true" }],
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Upload any supported file type to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folderName - Cloudinary folder to store the file
 * @returns {Promise<{url: string, public_id: string}>} File URL and public ID
 */
const uploadFile = async (filePath, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      resource_type: "auto",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary using public_id
 * @param {string} public_id - Cloudinary public ID of the image to delete
 * @returns {Promise<{success: boolean, message: string}>} Deletion result
 * @throws {Error} If deletion fails
 */
const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);

    // Cloudinary returns result: { result: 'ok' } on success
    if (result.result === "ok") {
      return {
        success: true,
        message: "Image deleted successfully",
      };
    }

    return {
      success: false,
      message: "Image not found or already deleted",
    };
  } catch (error) {
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

/**
 * Remove temporary file from disk (used after successful Cloudinary upload)
 * @param {string} filePath - Path to the temporary file
 */
const removeLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  uploadImage,
  uploadFile,
  deleteImage,
  removeLocalFile,
};
