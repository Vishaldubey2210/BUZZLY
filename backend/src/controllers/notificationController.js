'use strict';

const notificationService = require('../services/notificationService');
const { sendSuccess, sendPaginated } = require('../utils/response');
const { getPaginationOptions } = require('../utils/pagination');

class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationOptions(req.query);
      const { notifications, total } = await notificationService.getNotifications(req.user._id, skip, limit);
      sendPaginated(res, { data: notifications, page, limit, total });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const notification = await notificationService.markAsRead(req.params.id, req.user._id);
      sendSuccess(res, { data: notification, message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      await notificationService.markAllAsRead(req.user._id);
      sendSuccess(res, { message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
