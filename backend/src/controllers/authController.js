'use strict';

const authService = require('../services/authService');
const { sendSuccess } = require('../utils/response');

class AuthController {
  async signup(req, res, next) {
    try {
      const { user, tokens } = await authService.signup(req.body);

      // Set refresh token in httpOnly cookie
      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      sendSuccess(res, {
        data: { user, accessToken: tokens.accessToken },
        message: 'Registration successful',
        statusCode: 201,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, tokens } = await authService.login(email, password);

      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, {
        data: { user, accessToken: tokens.accessToken },
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      if (req.user) {
        await authService.logout(req.user._id);
      }
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'strict' });
      sendSuccess(res, { message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.jwt;
      if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'No refresh token' });
      }

      const { verifyRefreshToken, generateTokenPair } = require('../utils/jwt');
      const User = require('../models/User');

      let decoded;
      try {
        decoded = verifyRefreshToken(refreshToken);
      } catch {
        return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
      }

      const user = await User.findById(decoded.sub).select('+refreshToken');
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({ success: false, message: 'Refresh token mismatch' });
      }

      const tokens = generateTokenPair(user._id);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.cookie('jwt', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, { data: { accessToken: tokens.accessToken }, message: 'Token refreshed' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
