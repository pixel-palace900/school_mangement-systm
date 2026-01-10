const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for profile images
const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-management/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto' }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const userType = req.user?.role || 'user';
      const userId = req.user?.id || 'unknown';
      return `${userType}_${userId}_${timestamp}`;
    },
  },
});

// Storage configuration for assignment attachments
const assignmentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-management/assignments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'txt'],
    resource_type: 'auto',
    public_id: (req, file) => {
      const timestamp = Date.now();
      const assignmentId = req.params.assignmentId || req.body.assignmentId || 'assignment';
      return `assignment_${assignmentId}_${timestamp}`;
    },
  },
});

// Storage configuration for library resources
const libraryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-management/library',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'txt', 'mp4', 'mp3'],
    resource_type: 'auto',
    public_id: (req, file) => {
      const timestamp = Date.now();
      const resourceType = req.body.resourceType || 'resource';
      return `library_${resourceType}_${timestamp}`;
    },
  },
});

// Storage configuration for circular attachments
const circularStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-management/circulars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    resource_type: 'auto',
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `circular_${timestamp}`;
    },
  },
});

// Storage configuration for general documents
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school-management/documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'],
    resource_type: 'auto',
    public_id: (req, file) => {
      const timestamp = Date.now();
      const category = req.body.category || 'document';
      return `${category}_${timestamp}`;
    },
  },
});

// Multer upload configurations
const uploadProfileImage = multer({
  storage: profileImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile pictures'), false);
    }
  }
});

const uploadAssignment = multer({
  storage: assignmentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

const uploadLibraryResource = multer({
  storage: libraryStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for library resources
  }
});

const uploadCircular = multer({
  storage: circularStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  }
});

// Helper function to delete files from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};

// Helper function to get optimized URL
const getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  });
};

module.exports = {
  cloudinary,
  uploadProfileImage,
  uploadAssignment,
  uploadLibraryResource,
  uploadCircular,
  uploadDocument,
  deleteFromCloudinary,
  getOptimizedUrl
};
