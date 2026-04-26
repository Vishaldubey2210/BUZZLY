'use strict';

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'connection_request', 'connection_accepted', 'message', 'follow', 'repost', 'system'],
      required: true,
    },
    content: {
      type: String, // Dynamic text like "liked your post"
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId, // Could be postId, commentId, etc.
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for getting user's notifications efficiently
notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
