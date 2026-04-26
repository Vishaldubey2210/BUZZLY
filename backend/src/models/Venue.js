'use strict';

const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['bar', 'brewery', 'winery', 'club', 'rooftop', 'restaurant', 'cafe'], default: 'bar' },
    description: { type: String, maxlength: 500, default: '' },
    address: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, default: '' },
    image: { type: String, default: null },
    coverImage: { type: String, default: null },
    website: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    specialties: [{ type: String }],   // e.g., ['craft beer', 'whiskey']
    tags: [{ type: String }],           // e.g., ['rooftop', 'live music']
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    priceRange: { type: String, enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'], default: '₹₹' },
    openingHours: { type: String, default: '12:00 PM – 1:00 AM' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

venueSchema.index({ location: '2dsphere' });
venueSchema.index({ city: 1, isFeatured: -1 });

const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
