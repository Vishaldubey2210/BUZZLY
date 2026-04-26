'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../config/config');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    buzzName: {
      type: String,
      required: true,
      trim: true,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    },
    bio: {
      type: String,
      maxlength: 160,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    level: {
      type: Number,
      default: 1,
    },
    xp: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    // For storing general drink preferences (simplified for now)
    drinkPreferences: [{
      type: String,
      enum: ['beer', 'wine', 'spirit', 'cocktail', 'na'],
    }],
    socketId: {
        type: String,
        default: null
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
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

const User = mongoose.model('User', userSchema);

module.exports = User;
