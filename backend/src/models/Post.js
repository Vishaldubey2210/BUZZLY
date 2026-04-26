'use strict';

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, maxlength: 3000 },
    image: { type: String, default: null },
    drinkCategory: {
      type: String,
      enum: ['beer', 'wine', 'spirit', 'cocktail', 'na', 'other'],
      default: 'other',
    },
    vibeTag: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commentCount: { type: Number, default: 0 },
    reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    repostOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
    repostComment: { type: String, default: '' },
    venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', default: null },
    hashtags: [{ type: String }],
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ drinkCategory: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
// Text index for search
postSchema.index({ content: 'text' });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
