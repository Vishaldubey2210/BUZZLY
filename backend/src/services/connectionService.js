'use strict';

const Connection = require('../models/Connection');
const Notification = require('../models/Notification');

class ConnectionService {
  async sendRequest(requesterId, recipientId) {
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

    // Create Notification
    await Notification.create({
      recipient: recipientId,
      sender: requesterId,
      type: 'connection_request',
      content: 'sent you a pour request',
      referenceId: connection._id,
    });

    return connection;
  }

  async acceptRequest(connectionId, userId) {
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

    // Create Notification
    await Notification.create({
      recipient: connection.requester,
      sender: userId,
      type: 'connection_accepted',
      content: 'accepted your pour request',
      referenceId: connection._id,
    });

    return connection;
  }

  async getConnections(userId) {
    const connections = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted',
    })
    .populate('requester', 'buzzName handle avatar')
    .populate('recipient', 'buzzName handle avatar');

    // Extract the other user from the connection
    return connections.map(conn => {
      const isRequester = conn.requester._id.toString() === userId.toString();
      return isRequester ? conn.recipient : conn.requester;
    });
  }

  async getPendingRequests(userId) {
    return Connection.find({ recipient: userId, status: 'pending' })
      .populate('requester', 'buzzName handle avatar');
  }
}

module.exports = new ConnectionService();
