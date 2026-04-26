'use strict';

const messageService = require('../services/messageService');
const { sendSuccess, sendCreated, sendPaginated } = require('../utils/response');
const { getPaginationOptions } = require('../utils/pagination');

class MessageController {
  async getConversations(req, res, next) {
    try {
      const conversations = await messageService.getConversations(req.user._id);
      sendSuccess(res, { data: conversations });
    } catch (error) {
      next(error);
    }
  }

  async createConversation(req, res, next) {
    try {
      const conversation = await messageService.createConversation(req.user._id, req.body.participantId);
      sendCreated(res, { data: conversation });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationOptions(req.query);
      const { messages, total } = await messageService.getMessages(req.params.conversationId, skip, limit);
      sendPaginated(res, { data: messages, page, limit, total });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const message = await messageService.sendMessage(
        req.params.conversationId,
        req.user._id,
        req.body.text
      );
      sendCreated(res, { data: message });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();
