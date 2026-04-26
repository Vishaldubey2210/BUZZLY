'use strict';

const Room = require('../models/Room');

module.exports = (io, socket) => {
  
  // Join a WebRTC / YouTube Room
  socket.on('room:join', async (roomId) => {
    socket.join(`room_${roomId}`);
    
    // Notify others in the room
    socket.to(`room_${roomId}`).emit('room:user_joined', {
      userId: socket.user._id,
      buzzName: socket.user.buzzName,
      socketId: socket.id
    });
  });

  // Leave a WebRTC Room
  socket.on('room:leave', (roomId) => {
    socket.leave(`room_${roomId}`);
    socket.to(`room_${roomId}`).emit('room:user_left', {
      userId: socket.user._id,
      socketId: socket.id
    });
  });

  // WebRTC Signaling
  socket.on('webrtc:offer', ({ to, offer }) => {
    socket.to(to).emit('webrtc:offer', {
      from: socket.id,
      userId: socket.user._id,
      offer
    });
  });

  socket.on('webrtc:answer', ({ to, answer }) => {
    socket.to(to).emit('webrtc:answer', {
      from: socket.id,
      userId: socket.user._id,
      answer
    });
  });

  socket.on('webrtc:ice_candidate', ({ to, candidate }) => {
    socket.to(to).emit('webrtc:ice_candidate', {
      from: socket.id,
      userId: socket.user._id,
      candidate
    });
  });

  // YouTube Sync Logic
  socket.on('youtube:play', async ({ roomId, videoId, currentTime }) => {
    socket.to(`room_${roomId}`).emit('youtube:play', { videoId, currentTime });
    
    // Optionally save state to DB
    await Room.findByIdAndUpdate(roomId, {
      'nowPlaying.videoId': videoId,
      'nowPlaying.currentTime': currentTime,
      'nowPlaying.isPlaying': true,
      'nowPlaying.updatedAt': Date.now()
    });
  });

  socket.on('youtube:pause', async ({ roomId, currentTime }) => {
    socket.to(`room_${roomId}`).emit('youtube:pause', { currentTime });
    
    await Room.findByIdAndUpdate(roomId, {
      'nowPlaying.currentTime': currentTime,
      'nowPlaying.isPlaying': false,
      'nowPlaying.updatedAt': Date.now()
    });
  });

  socket.on('youtube:seek', async ({ roomId, currentTime }) => {
    socket.to(`room_${roomId}`).emit('youtube:seek', { currentTime });
    
    await Room.findByIdAndUpdate(roomId, {
      'nowPlaying.currentTime': currentTime,
      'nowPlaying.updatedAt': Date.now()
    });
  });

};
