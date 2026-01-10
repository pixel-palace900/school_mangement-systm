const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  dateOfBirth: Date,
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
  rollNumber: String,
  profileImage: {
    url: String,
    publicId: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  address: String,
  emergencyContact: String,
  bloodGroup: String,
  medicalConditions: [String],
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
studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Student', studentSchema);
