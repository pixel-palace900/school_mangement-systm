const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  subjectSpecialization: String,
  classAssigned: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  profileImage: {
    url: String,
    publicId: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  address: String,
  qualification: String,
  experience: String,
  joiningDate: Date,
  emergencyContact: String,
  employeeId: String,
  department: String,
  // For tracking when the record was created/updated
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
teacherSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Teacher', teacherSchema);
