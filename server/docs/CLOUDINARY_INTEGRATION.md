# Cloudinary Integration Documentation

## Overview

This document describes the Cloudinary integration implemented in the School Management System backend for handling file uploads, image processing, and media management.

## Features

- **Profile Image Management**: Upload, update, and delete profile images for all user types
- **Assignment Attachments**: Handle file uploads for assignments and submissions
- **Library Resources**: Manage digital resources (books, documents, videos, audio)
- **Circular Attachments**: Support file attachments for school circulars
- **Automatic Image Optimization**: Automatic format conversion and quality optimization
- **File Type Validation**: Restrict uploads based on file types and sizes
- **Secure File Deletion**: Clean up files when records are deleted

## Setup

### 1. Environment Variables

Add the following variables to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Get Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy the Cloud Name, API Key, and API Secret
4. Update your `.env` file with these values

## API Endpoints

### Profile Management

#### Upload Profile Image
```
POST /api/profile/upload-image
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: profileImage (file)
```

#### Delete Profile Image
```
DELETE /api/profile/delete-image
Authorization: Bearer <token>
```

### File Uploads

#### Upload Assignment Files
```
POST /api/upload/assignment/:assignmentId?
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: attachments[] (files, max 5)
```

#### Upload Library Resource
```
POST /api/upload/library-resource
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: resource (file)
```

#### Upload Circular Attachments
```
POST /api/upload/circular
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: attachments[] (files, max 3)
```

#### Upload General Document
```
POST /api/upload/document
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: document (file)
```

#### Delete File
```
DELETE /api/upload/file/:publicId?resourceType=image
Authorization: Bearer <token>
```

## File Organization

Files are organized in Cloudinary folders:

- `school-management/profile-images/` - User profile images
- `school-management/assignments/` - Assignment attachments
- `school-management/library/` - Library resources
- `school-management/circulars/` - Circular attachments
- `school-management/documents/` - General documents

## File Naming Convention

Files are automatically named using the following patterns:

- Profile Images: `{userType}_{userId}_{timestamp}`
- Assignments: `assignment_{assignmentId}_{timestamp}`
- Library: `library_{resourceType}_{timestamp}`
- Circulars: `circular_{timestamp}`
- Documents: `{category}_{timestamp}`

## File Size Limits

- Profile Images: 5MB
- Assignment Files: 10MB
- Library Resources: 50MB
- Circular Attachments: 10MB
- General Documents: 20MB

## Supported File Types

### Profile Images
- jpg, jpeg, png, gif

### Assignment Files
- Images: jpg, jpeg, png
- Documents: pdf, doc, docx, txt

### Library Resources
- Images: jpg, jpeg, png
- Documents: pdf, doc, docx, txt
- Media: mp4, mp3

### Circular Attachments
- Images: jpg, jpeg, png
- Documents: pdf, doc, docx

## Image Transformations

### Profile Images
- Automatic face detection and cropping
- Resized to 400x400 pixels
- Quality optimization
- Format conversion to WebP when supported

### General Optimizations
- Automatic quality adjustment
- Format conversion for better compression
- Responsive image delivery

## Database Schema Updates

### User Models (Student, Teacher, Admin, Parent)
```javascript
profileImage: {
  url: String,
  publicId: String,
  uploadedAt: Date
}
```

### File Attachment Schema
```javascript
attachments: [{
  fileName: String,
  fileUrl: String,
  publicId: String,
  fileType: String,
  fileSize: Number,
  uploadedAt: Date
}]
```

## Usage Examples

### Frontend Upload Example (React)

```javascript
const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('profileImage', file);

  try {
    const response = await fetch('/api/profile/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();
    if (result.success) {
      console.log('Image uploaded:', result.data.profileImage);
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Backend Controller Example

```javascript
const { uploadAssignment } = require('../config/cloudinary');
const { formatFilesData } = require('../utils/fileManager');

// In your controller
router.post('/assignment/:id/attachments', 
  protect,
  uploadAssignment.array('files', 5),
  async (req, res) => {
    try {
      const filesData = formatFilesData(req.files);
      
      // Update assignment with new attachments
      const assignment = await Assignment.findByIdAndUpdate(
        req.params.id,
        { $push: { attachments: { $each: filesData } } },
        { new: true }
      );

      res.json({ success: true, data: assignment });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);
```

## Error Handling

The system includes comprehensive error handling for:

- File size exceeded
- Invalid file types
- Upload failures
- Cloudinary API errors
- Network issues

## Security Features

- JWT authentication required for all uploads
- Role-based access control
- File type validation
- Size limit enforcement
- Secure file deletion

## Utilities

The `fileManager.js` utility provides helper functions:

- `formatFileData()` - Format single file data
- `formatFilesData()` - Format multiple files data
- `deleteFiles()` - Delete multiple files from Cloudinary
- `validateFileType()` - Validate file types
- `formatFileSize()` - Human-readable file sizes
- `getThumbnailUrl()` - Generate thumbnail URLs

## Best Practices

1. Always validate file types on both frontend and backend
2. Implement proper error handling for upload failures
3. Clean up orphaned files when deleting records
4. Use appropriate image transformations for different use cases
5. Monitor Cloudinary usage and quotas
6. Implement file compression for large uploads

## Troubleshooting

### Common Issues

1. **Upload fails with 401 error**
   - Check if JWT token is valid and included in request

2. **File type not supported**
   - Verify file type is in allowed formats list

3. **File size too large**
   - Check file size limits and compress if necessary

4. **Cloudinary credentials invalid**
   - Verify environment variables are set correctly

5. **Image not displaying**
   - Check if URL is accessible and file exists in Cloudinary

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will log detailed information about file uploads and Cloudinary operations.
