'use strict';

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
      default: '',
    },
    venue: {
      name: { type: String, required: true },
      address: { type: String, default: '' },
      city: { type: String, default: 'Mumbai' },
    },
    date: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: ['cocktail', 'beer', 'wine', 'spirit', 'mixer', 'other'],
      default: 'other',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxAttendees: {
      type: Number,
      default: null, // null means unlimited
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

eventSchema.index({ date: 1 });
eventSchema.index({ isFeatured: -1, date: 1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
