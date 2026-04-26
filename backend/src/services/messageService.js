'use strict';

const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

class MessageService {
  async getConversations(userId) {
    return Conversation.find({ participants: userId })
      .populate('participants', 'buzzName handle avatar')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
  }

  async createConversation(userId, participantId) {
    if (userId.toString() === participantId.toString()) {
      throw new Error('Cannot create conversation with yourself');
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, participantId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, participantId],
      });
    }

    return conversation;
  }

  async getMessages(conversationId, skip, limit) {
    const messages = await Message.find({ conversationId })
      .populate('sender', 'buzzName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Reverse to get chronological order for frontend display
    messages.reverse();

    const total = await Message.countDocuments({ conversationId });
    return { messages, total };
  }

  async sendMessage(conversationId, senderId, text) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    if (!conversation.participants.includes(senderId)) {
      throw new Error('Not part of this conversation');
    }

    const message = await Message.create({
      conversationId,
      sender: senderId,
      text,
    });

    conversation.lastMessage = message._id;
    conversation.updatedAt = Date.now();
    await conversation.save();

    return message.populate('sender', 'buzzName avatar');
  }
}

module.exports = new MessageService();
