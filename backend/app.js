'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const config = require('./src/config/config');
const { apiLimiter } = require('./src/middleware/rateLimiter');
const { notFound, errorHandler } = require('./src/middleware/error');

// Route imports
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const postRoutes = require('./src/routes/posts');
const connectionRoutes = require('./src/routes/connections');
const messageRoutes = require('./src/routes/messages');
const notificationRoutes = require('./src/routes/notifications');
const eventRoutes = require('./src/routes/events');
const searchRoutes = require('./src/routes/search');
const venueRoutes = require('./src/routes/venues');
const mentorRoutes = require('./src/routes/mentors');
const roomRoutes = require('./src/routes/rooms');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(apiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// API Routes
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/posts`, postRoutes);
app.use(`${API_PREFIX}/connections`, connectionRoutes);
app.use(`${API_PREFIX}/messages`, messageRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/events`, eventRoutes);
app.use(`${API_PREFIX}/search`, searchRoutes);
app.use(`${API_PREFIX}/venues`, venueRoutes);
app.use(`${API_PREFIX}/mentors`, mentorRoutes);
app.use(`${API_PREFIX}/rooms`, roomRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: config.env });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
