'use strict';

const mongoose = require('mongoose');

const mentorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    experienceYears: { type: Number, required: true },
    expertise: [{ type: String, required: true }],
    bio: { type: String, required: true, maxlength: 1000 },
    pricingPerSession: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 5.0 },
    sessionCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MentorProfile', mentorProfileSchema);
