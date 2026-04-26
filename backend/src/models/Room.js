'use strict';

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['public', 'private', 'request'], default: 'public' },
    inviteCode: { type: String, unique: true, sparse: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // For request-based rooms
    nowPlaying: {
      videoId: { type: String, default: null },
      currentTime: { type: Number, default: 0 },
      isPlaying: { type: Boolean, default: false },
      updatedAt: { type: Date, default: Date.now }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
