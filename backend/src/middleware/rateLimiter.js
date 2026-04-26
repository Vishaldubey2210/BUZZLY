'use strict';

const rateLimit = require('express-rate-limit');
const config = require('../config/config');

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max, // Limit each IP to X requests per `window`
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10, // 10 requests max for auth routes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};
