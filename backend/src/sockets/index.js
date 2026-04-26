'use strict';

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const logger = require('../utils/logger');
const chatHandler = require('./chatHandler');
const notificationHandler = require('./notificationHandler');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: config.cors.origin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      jwt.verify(token, config.jwt.accessSecret, async (err, decoded) => {
        if (err) return next(new Error('Authentication error: Invalid token'));

        const user = await User.findById(decoded.sub);
        if (!user) return next(new Error('Authentication error: User not found'));

        socket.user = user;
        next();
      });
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    logger.info(`Socket connected: ${socket.id} (User: ${socket.user._id})`);

    // Update user socket ID
    await User.findByIdAndUpdate(socket.user._id, { 
      socketId: socket.id,
      lastActive: Date.now()
    });

    // Join personal room for receiving direct events (notifications, etc)
    socket.join(socket.user._id.toString());

    // Register handlers
    chatHandler(io, socket);
    notificationHandler(io, socket);

    socket.on('disconnect', async () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      await User.findByIdAndUpdate(socket.user._id, { 
        socketId: null,
        lastActive: Date.now()
      });
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo };
