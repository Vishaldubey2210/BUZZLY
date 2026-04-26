'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

const drinkJourneyEntrySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },      // e.g., "Head Bartender"
  place: { type: String, required: true, trim: true },      // e.g., "The Tipsy Bear, Mumbai"
  description: { type: String, default: '', maxlength: 300 },
  startDate: { type: Date },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
}, { _id: true });

const badgeSchema = new mongoose.Schema({
  id: String,        // e.g., "first_post", "social_butterfly"
  name: String,
  icon: String,
  earnedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    buzzName: { type: String, required: true, trim: true },
    handle: { type: String, required: true, unique: true, trim: true, lowercase: true },
    avatar: { type: String, default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default' },
    coverImage: { type: String, default: null },
    bio: { type: String, maxlength: 300, default: '' },
    headline: { type: String, maxlength: 120, default: '' }, // LinkedIn "headline"
    city: { type: String, default: '' },
    website: { type: String, default: '' },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    refreshToken: { type: String, select: false },
    drinkPreferences: [{ type: String, enum: ['beer', 'wine', 'spirit', 'cocktail', 'na'] }],
    drinkJourney: [drinkJourneyEntrySchema],
    badges: [badgeSchema],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followedVenues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }],
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    },
    locationSet: { type: Boolean, default: false },
    socketId: { type: String, default: null },
    lastActive: { type: Date, default: Date.now },
    isPrivate: { type: Boolean, default: false },
    notificationPrefs: {
      likes: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      connections: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(config.bcryptRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ buzzName: 'text', handle: 'text', headline: 'text', city: 'text' });
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);
module.exports = User;
