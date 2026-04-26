'use strict';

const Notification = require('../models/Notification');

class NotificationService {
  async getNotifications(userId, skip, limit) {
    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'buzzName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ recipient: userId });
    return { notifications, total };
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error('Notification not found');

    if (notification.recipient.toString() !== userId.toString()) {
      throw new Error('Not authorized');
    }

    notification.isRead = true;
    await notification.save();
    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
    return true;
  }
}

module.exports = new NotificationService();
