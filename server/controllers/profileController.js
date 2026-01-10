const { success, error } = require('../utils/responseHandler');
const { deleteFromCloudinary } = require('../config/cloudinary');
const { formatFileData } = require('../utils/fileManager');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Parent = require('../models/Parent');

/**
 * Get user model based on role
 * @param {String} role - User role
 * @returns {Object} Mongoose model
 */
const getUserModel = (role) => {
  switch (role) {
    case 'student':
      return Student;
    case 'teacher':
      return Teacher;
    case 'admin':
      return Admin;
    case 'parent':
      return Parent;
    default:
      throw new Error('Invalid user role');
  }
};

/**
 * Upload profile image
 * @route POST /api/profile/upload-image
 * @access Private
 */
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, 'No image file uploaded', 400);
    }

    const userId = req.user.id;
    const userRole = req.user.role;
    const UserModel = getUserModel(userRole);

    // Get current user to check for existing profile image
    const user = await UserModel.findById(userId);
    if (!user) {
      return error(res, 'User not found', 404);
    }

    // Delete old profile image if exists
    if (user.profileImage && user.profileImage.publicId) {
      try {
        await deleteFromCloudinary(user.profileImage.publicId, 'image');
      } catch (deleteError) {
        console.error('Error deleting old profile image:', deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Format new file data
    const profileImageData = formatFileData(req.file);

    // Update user with new profile image
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        profileImage: {
          url: profileImageData.fileUrl,
          publicId: profileImageData.publicId,
          uploadedAt: profileImageData.uploadedAt
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    return success(res, {
      user: updatedUser,
      profileImage: updatedUser.profileImage
    }, 'Profile image uploaded successfully');

  } catch (err) {
    console.error('Profile image upload error:', err);
    return error(res, 'Failed to upload profile image', 500, err.message);
  }
};

/**
 * Delete profile image
 * @route DELETE /api/profile/delete-image
 * @access Private
 */
exports.deleteProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const UserModel = getUserModel(userRole);

    // Get current user
    const user = await UserModel.findById(userId);
    if (!user) {
      return error(res, 'User not found', 404);
    }

    if (!user.profileImage || !user.profileImage.publicId) {
      return error(res, 'No profile image to delete', 400);
    }

    // Delete image from Cloudinary
    try {
      await deleteFromCloudinary(user.profileImage.publicId, 'image');
    } catch (deleteError) {
      console.error('Error deleting profile image from Cloudinary:', deleteError);
      // Continue with database update even if Cloudinary deletion fails
    }

    // Remove profile image from user document
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $unset: { profileImage: 1 }
      },
      { new: true }
    ).select('-password');

    return success(res, {
      user: updatedUser
    }, 'Profile image deleted successfully');

  } catch (err) {
    console.error('Profile image deletion error:', err);
    return error(res, 'Failed to delete profile image', 500, err.message);
  }
};

/**
 * Get user profile with image
 * @route GET /api/profile
 * @access Private
 */
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const UserModel = getUserModel(userRole);

    const user = await UserModel.findById(userId)
      .select('-password')
      .populate('classId', 'name section')
      .populate('parentId', 'name email phone')
      .populate('children', 'name email rollNumber classId');

    if (!user) {
      return error(res, 'User not found', 404);
    }

    return success(res, user, 'User profile retrieved successfully');

  } catch (err) {
    console.error('Get user profile error:', err);
    return error(res, 'Failed to get user profile', 500, err.message);
  }
};

/**
 * Update user profile
 * @route PUT /api/profile
 * @access Private
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const UserModel = getUserModel(userRole);

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, email, role, ...updateData } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return error(res, 'User not found', 404);
    }

    return success(res, updatedUser, 'Profile updated successfully');

  } catch (err) {
    console.error('Update user profile error:', err);
    return error(res, 'Failed to update profile', 500, err.message);
  }
};
