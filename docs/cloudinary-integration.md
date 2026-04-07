# Cloudinary Integration Guide

Complete implementation of image upload and deletion system using Cloudinary and Multer.

## Environment Variables Required

Add these to your `.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Installation

Install dependencies:
```bash
npm install
```

This installs:
- `cloudinary` - Cloudinary SDK
- `multer` - File upload middleware

## Architecture

### 1. Configuration: `src/config/cloudinary.js`
- Loads Cloudinary credentials from environment variables
- Exports configured Cloudinary instance
- Validates credentials on startup

### 2. Service Layer: `src/services/cloudinaryService.js`

**Functions:**

#### `uploadImage(filePath, folderName)`
- Uploads image to Cloudinary in specified folder
- Applies automatic optimization: `f_auto`, `q_auto`
- Returns: `{ url, public_id }`
- Folder structure: `blogs/{blogId}`, `cs_uploads/`, etc.

#### `deleteImage(public_id)`
- Deletes image from Cloudinary
- Returns: `{ success: boolean, message: string }`

#### `removeLocalFile(filePath)`
- Removes temporary file from disk after successful upload
- Safe deletion (checks if file exists first)

### 3. Middleware: `src/middlewares/uploadMiddleware.js`
- Multer configuration for temporary file handling
- File validation: Only images allowed (jpeg, png, gif, webp)
- Size limit: 5MB per file
- Temporary files stored in `temp-uploads/` directory
- Files deleted after successful Cloudinary upload

### 4. Blog Model Updates: `src/models/Blog.js`
- Added `imageUrl` field (string, nullable)
- Added `imagePublicId` field (string, nullable)
- Pre-delete hook automatically deletes image from Cloudinary when blog is deleted

### 5. Blog Controller: `src/controllers/blogController.js`

**New Functions:**

#### `uploadBlogImage(req, res)`
- Route: `POST /api/uploads/blog/:id/image`
- Uploads image to `blogs/{blogId}` folder
- Updates blog record with image data
- Automatically deletes old image if replacing
- Returns blog object with new image data

#### `deleteBlogImage(req, res)`
- Route: `DELETE /api/uploads/blog/:id/image`
- Removes image from Cloudinary
- Clears image fields from blog record

### 6. Routes: `src/routes/uploadRoutes.js`

#### Blog Image Endpoints

**Upload blog image:**
```
POST /api/uploads/blog/:id/image
Authorization: Required
Body: multipart/form-data with "image" field
Response: { success, data: { blog } }
```

**Delete blog image:**
```
DELETE /api/uploads/blog/:id/image
Authorization: Required
Response: { success, data: { blog } }
```

#### CS Uploads Endpoint

**Upload CS document/file:**
```
POST /api/uploads/cs
Authorization: Required
Body: multipart/form-data with "file" field
Response: { success, data: { url, public_id } }
Folder in Cloudinary: cs_uploads/
```

#### Generic Image Deletion

**Delete any image by public_id:**
```
DELETE /api/uploads/:public_id
Authorization: Required
Response: { success, message }
```

## Folder Structure in Cloudinary

Images are organized as:
```
cloudinary/
  blogs/
    {blogId}/
      image.png
  cs_uploads/
    document.pdf.png
    ...
```

This organization allows:
- Easy folder-based management
- Bulk deletion by folder if needed
- Clear separation of document types

## Error Handling

All endpoints follow consistent error response format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

Common errors:
- `400: No file uploaded` - File field missing
- `404: Blog not found` - Invalid blog ID
- `400: Only image files are allowed` - Wrong file type
- `413: File too large` - Exceeds 5MB limit
- `500: Cloudinary upload failed` - API error

## Usage Examples

### Upload Blog Image (cURL)

```bash
curl -X POST http://localhost:5000/api/uploads/blog/123/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

### Delete Blog Image (cURL)

```bash
curl -X DELETE http://localhost:5000/api/uploads/blog/123/image \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Upload CS Document (cURL)

```bash
curl -X POST http://localhost:5000/api/uploads/cs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

### Delete Image by Public ID (cURL)

```bash
curl -X DELETE http://localhost:5000/api/uploads/blog%2F123%2Fimage \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Code Quality Features

✅ **Async/Await** - All I/O operations use modern async patterns
✅ **Error Handling** - Try/catch blocks with meaningful error messages
✅ **Modular** - Service layer separates concerns
✅ **Comments** - Important logic documented
✅ **File Cleanup** - Temporary files removed after upload
✅ **Validation** - File types and sizes validated
✅ **DB Hooks** - Automatic cleanup on blog deletion
✅ **Authorization** - All upload endpoints require authentication

## Security Considerations

1. **File Upload** - Only images allowed (jpeg, png, gif, webp)
2. **File Size** - Limited to 5MB per file
3. **Authentication** - All upload endpoints require login
4. **Temporary Files** - Cleaned up immediately after upload
5. **Cloudinary Folder Structure** - Organized to prevent accidental deletions
6. **Error Messages** - Generic errors in responses (no sensitive data exposed)

## Testing Checklist

- [ ] Set environment variables correctly
- [ ] Create blog with image upload
- [ ] Verify image appears in Cloudinary folders
- [ ] Delete blog image and verify removal from Cloudinary
- [ ] Upload CS document and receive public_id
- [ ] Delete uploaded image using public_id
- [ ] Test with invalid file types (should be rejected)
- [ ] Test with files >5MB (should be rejected)
- [ ] Test without authentication (should be rejected)
- [ ] Verify temporary files are cleaned up

## Backward Compatibility

✅ **No Breaking Changes** - All existing endpoints work unchanged
✅ **Modular** - New upload system is separate from existing controllers
✅ **Optional** - Blog images are optional (null if not provided)
✅ **Safe** - Existing blog operations unaffected

## Storage Limits

- Cloudinary free tier: 25 MB storage
- Recommended: Use paid plan for production
- Monitor storage usage in Cloudinary dashboard

## Troubleshooting

**Issue: "No such file or directory: temp-uploads"**
- Middleware creates this automatically on first request
- Or create manually: `mkdir src/temp-uploads`

**Issue: "Cloudinary upload failed"**
- Check environment variables are set correctly
- Verify Cloudinary credentials are valid
- Check firewall/network access to Cloudinary API

**Issue: "Only image files are allowed"**
- Ensure you're uploading jpeg, png, gif, or webp
- Check Content-Type header is correct

**Issue: Image persists after blog deletion**
- Pre-delete hook may fail silently (logged to console)
- Manually delete from Cloudinary dashboard if needed
- Check Cloudinary API key has delete permissions

## Next Steps

1. Install packages: `npm install`
2. Add environment variables to `.env`
3. Test endpoints using examples above
4. Integrate frontend upload form
5. Monitor Cloudinary dashboard for storage usage
