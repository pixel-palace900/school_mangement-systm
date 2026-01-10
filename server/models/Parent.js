const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  profileImage: {
    url: String,
    publicId: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  occupation: String,
  emergencyContact: String,
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
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
parentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Parent', parentSchema);
