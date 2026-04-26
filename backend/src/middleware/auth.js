'use strict';

const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const { sendError } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, { message: 'Not authorized, no token provided', statusCode: 401 });
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.sub);
    if (!user) {
      return sendError(res, { message: 'Not authorized, user no longer exists', statusCode: 401 });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, { message: 'Token expired', statusCode: 401 });
    }
    return sendError(res, { message: 'Not authorized, invalid token', statusCode: 401 });
  }
};

module.exports = { protect };
