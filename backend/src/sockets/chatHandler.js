'use strict';

const logger = require('../utils/logger');

module.exports = (io, socket) => {
  // Join a conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    logger.debug(`User ${socket.user._id} joined conversation ${conversationId}`);
  });

  // Leave a conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);
    logger.debug(`User ${socket.user._id} left conversation ${conversationId}`);
  });

  // Handle new message (client tells server a message was sent)
  socket.on('send_message', (data) => {
    // data should contain { conversationId, message }
    // Broadcast to everyone in the room except sender
    socket.to(data.conversationId).emit('receive_message', data.message);
  });

  // Typing indicators
  socket.on('typing', (data) => {
    socket.to(data.conversationId).emit('user_typing', {
      userId: socket.user._id,
      conversationId: data.conversationId,
    });
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.conversationId).emit('user_stop_typing', {
      userId: socket.user._id,
      conversationId: data.conversationId,
    });
  });
};
