const { deleteFromCloudinary, getOptimizedUrl } = require('../config/cloudinary');

/**
 * Helper function to format file data for database storage
 * @param {Object} file - Multer file object from Cloudinary
 * @returns {Object} Formatted file data
 */
const formatFileData = (file) => {
  return {
    fileName: file.originalname,
    fileUrl: file.path,
    publicId: file.filename,
    fileType: file.mimetype,
    fileSize: file.size,
    uploadedAt: new Date()
  };
};

/**
 * Helper function to format multiple files data
 * @param {Array} files - Array of Multer file objects from Cloudinary
 * @returns {Array} Array of formatted file data
 */
const formatFilesData = (files) => {
  return files.map(formatFileData);
};

/**
 * Delete files from Cloudinary and return results
 * @param {Array} attachments - Array of attachment objects with publicId
 * @returns {Promise<Array>} Array of deletion results
 */
const deleteFiles = async (attachments) => {
  const deletionPromises = attachments.map(async (attachment) => {
    try {
      if (attachment.publicId) {
        // Determine resource type based on file type
        let resourceType = 'image';
        if (attachment.fileType) {
          if (attachment.fileType.startsWith('video/')) {
            resourceType = 'video';
          } else if (attachment.fileType === 'application/pdf' || 
                     attachment.fileType.includes('document') ||
                     attachment.fileType.includes('text')) {
            resourceType = 'raw';
          }
        }
        
        const result = await deleteFromCloudinary(attachment.publicId, resourceType);
        return {
          publicId: attachment.publicId,
          success: result.result === 'ok',
          result
        };
      }
      return {
        publicId: attachment.publicId,
        success: false,
        error: 'No public ID provided'
      };
    } catch (error) {
      return {
        publicId: attachment.publicId,
        success: false,
        error: error.message
      };
    }
  });

  return Promise.all(deletionPromises);
};

/**
 * Get optimized URLs for files
 * @param {Array} attachments - Array of attachment objects
 * @param {Object} options - Optimization options
 * @returns {Array} Array of attachments with optimized URLs
 */
const getOptimizedFiles = (attachments, options = {}) => {
  return attachments.map(attachment => {
    if (attachment.publicId) {
      const optimizedUrl = getOptimizedUrl(attachment.publicId, options);
      return {
        ...attachment,
        optimizedUrl
      };
    }
    return attachment;
  });
};

/**
 * Validate file type against allowed types
 * @param {String} fileType - MIME type of the file
 * @param {Array} allowedTypes - Array of allowed MIME types
 * @returns {Boolean} Whether file type is allowed
 */
const validateFileType = (fileType, allowedTypes) => {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return fileType.startsWith(type.slice(0, -1));
    }
    return fileType === type;
  });
};

/**
 * Get file size in human readable format
 * @param {Number} bytes - File size in bytes
 * @returns {String} Human readable file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extract public ID from Cloudinary URL
 * @param {String} url - Cloudinary URL
 * @returns {String} Public ID
 */
const extractPublicId = (url) => {
  if (!url) return null;
  
  try {
    // Extract public ID from Cloudinary URL
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1 && uploadIndex < parts.length - 1) {
      // Get everything after 'upload' and any transformations
      const afterUpload = parts.slice(uploadIndex + 1);
      // Remove version if present (starts with 'v' followed by numbers)
      const withoutVersion = afterUpload.filter(part => !/^v\d+$/.test(part));
      // Join the remaining parts and remove file extension
      const publicId = withoutVersion.join('/').replace(/\.[^/.]+$/, '');
      return publicId;
    }
  } catch (error) {
    console.error('Error extracting public ID:', error);
  }
  
  return null;
};

/**
 * Clean up orphaned files (files that are no longer referenced in database)
 * @param {Array} currentFiles - Array of current file public IDs
 * @param {Array} newFiles - Array of new file public IDs
 * @returns {Promise<Array>} Array of deletion results for orphaned files
 */
const cleanupOrphanedFiles = async (currentFiles, newFiles) => {
  const orphanedFiles = currentFiles.filter(file => 
    !newFiles.some(newFile => newFile.publicId === file.publicId)
  );
  
  if (orphanedFiles.length > 0) {
    return await deleteFiles(orphanedFiles);
  }
  
  return [];
};

/**
 * Generate thumbnail URL for images
 * @param {String} publicId - Cloudinary public ID
 * @param {Object} options - Thumbnail options
 * @returns {String} Thumbnail URL
 */
const getThumbnailUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: 150,
    height: 150,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  };
  
  return getOptimizedUrl(publicId, { ...defaultOptions, ...options });
};

module.exports = {
  formatFileData,
  formatFilesData,
  deleteFiles,
  getOptimizedFiles,
  validateFileType,
  formatFileSize,
  extractPublicId,
  cleanupOrphanedFiles,
  getThumbnailUrl
};
