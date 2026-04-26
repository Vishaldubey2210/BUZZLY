'use strict';

// Currently empty, but reserved for specific client-to-server notification events
// For Server-to-Client notifications, the server will just use io.to(userId).emit(...)

module.exports = (io, socket) => {
  socket.on('mark_notification_read', (notificationId) => {
    // Client can optionally emit this to update via socket instead of REST API
    // Basic stub for real-time reactivity
  });
};
