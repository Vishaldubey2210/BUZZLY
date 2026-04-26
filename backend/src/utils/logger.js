'use strict';

const winston = require('winston');
const config = require('../config/config');

const { combine, timestamp, printf, colorize, errors } = winston.format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level: config.env === 'production' ? 'warn' : 'debug',
  format: config.env === 'production' ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
