'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
    issuer: 'buzzly',
    audience: 'buzzly-client',
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: 'buzzly',
    audience: 'buzzly-client',
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.accessSecret, {
    issuer: 'buzzly',
    audience: 'buzzly-client',
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret, {
    issuer: 'buzzly',
    audience: 'buzzly-client',
  });
};

const generateTokenPair = (userId) => {
  const payload = { sub: userId.toString() };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
};
