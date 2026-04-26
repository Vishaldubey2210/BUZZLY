'use strict';

const Connection = require('../models/Connection');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Helper to emit socket notification
const pushNotification = async (io, notifData) => {
  try {
    const notif = await Notification.create(notifData);
    const populated = await notif.populate('sender', 'buzzName avatar');
    if (io) {
      io.to(notifData.recipient.toString()).emit('new_notification', populated);
    }
    return populated;
  } catch (e) {
    // Non-fatal
  }
};

class ConnectionService {
  async sendRequest(requesterId, recipientId, io) {
    if (requesterId.toString() === recipientId.toString()) {
      throw new Error('Cannot connect with yourself');
    }

    const existing = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existing) {
      throw new Error('Connection or request already exists');
    }

    const connection = await Connection.create({
      requester: requesterId,
      recipient: recipientId,
    });

    // Push notification
    await pushNotification(io, {
      recipient: recipientId,
      sender: requesterId,
      type: 'connection_request',
      content: 'sent you a pour request 🍻',
      referenceId: connection._id,
    });

    return connection;
  }

  async acceptRequest(connectionId, userId, io) {
    const connection = await Connection.findById(connectionId);
    if (!connection) throw new Error('Connection request not found');

    if (connection.recipient.toString() !== userId.toString()) {
      throw new Error('Not authorized to accept this request');
    }

    if (connection.status !== 'pending') {
      throw new Error('Request already processed');
    }

    connection.status = 'accepted';
    await connection.save();

    // Award XP to both users
    await User.findByIdAndUpdate(connection.requester, { $inc: { xp: 100 } });
    await User.findByIdAndUpdate(userId, { $inc: { xp: 100 } });

    // Update level (1 level per 1000 XP)
    const updateLevel = async (uid) => {
      const u = await User.findById(uid);
      if (u) {
        const newLevel = Math.floor(u.xp / 1000) + 1;
        if (newLevel > u.level) await User.findByIdAndUpdate(uid, { level: newLevel });
      }
    };
    await updateLevel(connection.requester);
    await updateLevel(userId);

    // Push notification to requester
    await pushNotification(io, {
      recipient: connection.requester,
      sender: userId,
      type: 'connection_accepted',
      content: 'accepted your pour request 🥂',
      referenceId: connection._id,
    });

    return connection;
  }

  async rejectRequest(connectionId, userId) {
    const connection = await Connection.findById(connectionId);
    if (!connection) throw new Error('Connection request not found');

    if (connection.recipient.toString() !== userId.toString()) {
      throw new Error('Not authorized to reject this request');
    }

    connection.status = 'rejected';
    await connection.save();
    return connection;
  }

  async getConnections(userId) {
    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted',
    })
      .populate('requester', 'buzzName handle avatar level xp')
      .populate('recipient', 'buzzName handle avatar level xp');

    return connections.map((conn) => {
      const isRequester = conn.requester._id.toString() === userId.toString();
      return isRequester ? conn.recipient : conn.requester;
    });
  }

  async getPendingRequests(userId) {
    return Connection.find({ recipient: userId, status: 'pending' }).populate(
      'requester',
      'buzzName handle avatar level xp'
    );
  }
}

module.exports = new ConnectionService();
