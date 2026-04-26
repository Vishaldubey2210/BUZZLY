'use strict';

const User = require('../models/User');
const { generateTokenPair } = require('../utils/jwt');

class AuthService {
  async signup(data) {
    const existingUser = await User.findOne({ 
      $or: [{ email: data.email }, { handle: data.handle }] 
    });
    
    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new Error('Email already in use');
      }
      throw new Error('Handle already taken');
    }

    const user = await User.create(data);
    const tokens = generateTokenPair(user._id);

    user.refreshToken = tokens.refreshToken;
    await user.save();

    const userData = {
      _id: user._id,
      email: user.email,
      buzzName: user.buzzName,
      handle: user.handle,
      avatar: user.avatar,
    };

    return { user: userData, tokens };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const tokens = generateTokenPair(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    const userData = {
      _id: user._id,
      email: user.email,
      buzzName: user.buzzName,
      handle: user.handle,
      avatar: user.avatar,
    };

    return { user: userData, tokens };
  }

  async logout(userId) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async refreshToken(token) {
    // Logic goes here (verify token, find user, generate new pair)
    // Simplified for MVP structure
    return null;
  }
}

module.exports = new AuthService();
