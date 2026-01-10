const Admin = require('../models/Admin');
const { success, error } = require('../utils/responseHandler');

// Controller methods for Admin model

/**
 * Get all admins
 * @route GET /api/admin
 * @access Private/Admin
 */
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    return success(res, { admins, count: admins.length }, 'Admins retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve admins', 500, err.message);
  }
};

/**
 * Get single admin by ID
 * @route GET /api/admin/:id
 * @access Private/Admin
 */
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');

    if (!admin) {
      return error(res, 'Admin not found with this ID', 404);
    }

    return success(res, admin, 'Admin retrieved successfully');
  } catch (err) {
    // Check if error is a valid ObjectId format error
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }

    return error(res, 'Failed to retrieve admin', 500, err.message);
  }
};

/**
 * Create new admin
 * @route POST /api/admin
 * @access Private/Admin
 */
exports.createAdmin = async (req, res) => {
  try {
    // Check if admin with this email already exists
    const existingAdmin = await Admin.findOne({ email: req.body.email });

    if (existingAdmin) {
      return error(res, 'Admin with this email already exists', 400);
    }

    // Check if employeeId already exists (if provided)
    if (req.body.employeeId) {
      const existingEmployeeId = await Admin.findOne({ employeeId: req.body.employeeId });
      if (existingEmployeeId) {
        return error(res, 'Admin with this employee ID already exists', 400);
      }
    }

    // Create new admin
    const admin = new Admin({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // In a real app, hash this password
      phone: req.body.phone,
      role: req.body.role || 'admin',
      profileUrl: req.body.profileUrl,
      address: req.body.address,
      bio: req.body.bio,
      employeeId: req.body.employeeId,
      joiningDate: req.body.joiningDate
    });

    const savedAdmin = await admin.save();

    // Don't return password in response
    const adminResponse = {
      _id: savedAdmin._id,
      name: savedAdmin.name,
      email: savedAdmin.email,
      phone: savedAdmin.phone,
      role: savedAdmin.role,
      profileUrl: savedAdmin.profileUrl,
      address: savedAdmin.address,
      bio: savedAdmin.bio,
      employeeId: savedAdmin.employeeId,
      joiningDate: savedAdmin.joiningDate,
      createdAt: savedAdmin.createdAt,
      updatedAt: savedAdmin.updatedAt
    };

    return success(res, adminResponse, 'Admin created successfully', 201);
  } catch (err) {
    return error(res, 'Failed to create admin', 500, err.message);
  }
};

/**
 * Update admin
 * @route PUT /api/admin/:id
 * @access Private/Admin
 */
exports.updateAdmin = async (req, res) => {
  try {
    // Check if admin exists
    let admin = await Admin.findById(req.params.id);

    if (!admin) {
      return error(res, 'Admin not found with this ID', 404);
    }

    // If email is being updated, check if it's already in use
    if (req.body.email && req.body.email !== admin.email) {
      const emailExists = await Admin.findOne({ email: req.body.email });

      if (emailExists) {
        return error(res, 'Email already in use', 400);
      }
    }

    // If employeeId is being updated, check if it's already in use
    if (req.body.employeeId && req.body.employeeId !== admin.employeeId) {
      const employeeIdExists = await Admin.findOne({ employeeId: req.body.employeeId });

      if (employeeIdExists) {
        return error(res, 'Employee ID already in use', 400);
      }
    }

    // Update admin
    admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    return success(res, admin, 'Admin updated successfully');
  } catch (err) {
    // Check if error is a valid ObjectId format error
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }

    return error(res, 'Failed to update admin', 500, err.message);
  }
};

/**
 * Delete admin
 * @route DELETE /api/admin/:id
 * @access Private/Admin
 */
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return error(res, 'Admin not found with this ID', 404);
    }

    await Admin.findByIdAndDelete(req.params.id);

    return success(res, null, 'Admin deleted successfully');
  } catch (err) {
    // Check if error is a valid ObjectId format error
    if (err.kind === 'ObjectId') {
      return error(res, 'Invalid ID format', 400);
    }

    return error(res, 'Failed to delete admin', 500, err.message);
  }
};

/**
 * Get admin profile (current logged-in admin)
 * @route GET /api/admin/profile
 * @access Private/Admin
 */
exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await Admin.findById(adminId).select('-password');

    if (!admin) {
      return error(res, 'Admin not found', 404);
    }

    return success(res, admin, 'Admin profile retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve admin profile', 500, err.message);
  }
};

/**
 * Update admin profile (current logged-in admin)
 * @route PUT /api/admin/profile
 * @access Private/Admin
 */
exports.updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, email, role, ...updateData } = req.body;

    // Check if employeeId is being updated and if it already exists
    if (updateData.employeeId) {
      const existingEmployeeId = await Admin.findOne({
        employeeId: updateData.employeeId,
        _id: { $ne: adminId } // Exclude current admin
      });
      if (existingEmployeeId) {
        return error(res, 'Employee ID already in use', 400);
      }
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedAdmin) {
      return error(res, 'Admin not found', 404);
    }

    return success(res, updatedAdmin, 'Admin profile updated successfully');
  } catch (err) {
    return error(res, 'Failed to update admin profile', 500, err.message);
  }
};

/**
 * Upload admin profile image
 * @route POST /api/admin/profile/upload-image
 * @access Private/Admin
 */
exports.uploadAdminProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, 'No image file uploaded', 400);
    }

    const adminId = req.user.id;
    const { deleteFromCloudinary } = require('../config/cloudinary');

    // Get current admin to check for existing profile image
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return error(res, 'Admin not found', 404);
    }

    // Delete old profile image from Cloudinary if it exists
    if (admin.profileUrl && admin.profileUrl.includes('cloudinary.com')) {
      try {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
        const urlParts = admin.profileUrl.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');

        if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
          // Get everything after 'upload/v{version}/' or 'upload/'
          const pathAfterUpload = urlParts.slice(uploadIndex + 1);
          // Remove version if present (starts with 'v' followed by numbers)
          const pathWithoutVersion = pathAfterUpload[0].match(/^v\d+$/)
            ? pathAfterUpload.slice(1)
            : pathAfterUpload;

          // Join the path and remove file extension
          const publicIdWithExtension = pathWithoutVersion.join('/');
          const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');

          console.log('Attempting to delete old profile image with public_id:', publicId);
          await deleteFromCloudinary(publicId);
        }
      } catch (deleteError) {
        console.error('Error deleting old profile image:', deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Update admin with new profile image URL
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      {
        $set: {
          profileUrl: req.file.path
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    return success(res, updatedAdmin, 'Profile image uploaded successfully');
  } catch (err) {
    return error(res, 'Failed to upload profile image', 500, err.message);
  }
};

/**
 * Search admins by various criteria
 * @route GET /api/admin/search
 * @access Private/Admin
 */
exports.searchAdmins = async (req, res) => {
  try {
    const { name, email, employeeId, role, page = 1, limit = 10 } = req.query;

    // Build search query
    const searchQuery = {};

    if (name) {
      searchQuery.name = { $regex: name, $options: 'i' };
    }

    if (email) {
      searchQuery.email = { $regex: email, $options: 'i' };
    }

    if (employeeId) {
      searchQuery.employeeId = { $regex: employeeId, $options: 'i' };
    }

    if (role) {
      searchQuery.role = role;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search with pagination
    const admins = await Admin.find(searchQuery)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const totalCount = await Admin.countDocuments(searchQuery);

    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      totalCount,
      hasNext: skip + admins.length < totalCount,
      hasPrev: parseInt(page) > 1
    };

    return success(res, { admins, pagination }, 'Admins search completed successfully');
  } catch (err) {
    return error(res, 'Failed to search admins', 500, err.message);
  }
};

/**
 * Get admin statistics
 * @route GET /api/admin/stats
 * @access Private/Admin
 */
exports.getAdminStats = async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    const activeAdmins = await Admin.countDocuments({ role: 'admin' });
    const superAdmins = await Admin.countDocuments({ role: 'super_admin' });

    // Get admins created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentAdmins = await Admin.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get admins by role distribution
    const roleDistribution = await Admin.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      totalAdmins,
      activeAdmins,
      superAdmins,
      recentAdmins,
      roleDistribution
    };

    return success(res, stats, 'Admin statistics retrieved successfully');
  } catch (err) {
    return error(res, 'Failed to retrieve admin statistics', 500, err.message);
  }
};
