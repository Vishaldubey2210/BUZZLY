'use strict';

const User = require('../models/User');
const Post = require('../models/Post');
const Connection = require('../models/Connection');

class SearchService {
  async search(query, type, currentUserId, skip, limit) {
    const results = { users: [], posts: [], total: 0 };
    if (!query || query.trim().length < 1) return results;

    const q = query.trim();

    if (type === 'all' || type === 'users') {
      const users = await User.find({
        $or: [
          { buzzName: { $regex: q, $options: 'i' } },
          { handle: { $regex: q, $options: 'i' } },
          { bio: { $regex: q, $options: 'i' } },
          { city: { $regex: q, $options: 'i' } },
        ],
        _id: { $ne: currentUserId },
      })
        .select('buzzName handle avatar level xp bio city headline drinkPreferences')
        .limit(type === 'users' ? limit : 8)
        .skip(type === 'users' ? skip : 0);
      results.users = users;
    }

    if (type === 'all' || type === 'posts') {
      const posts = await Post.find({
        $or: [
          { content: { $regex: q, $options: 'i' } },
          { drinkCategory: { $regex: q, $options: 'i' } },
          { vibeTag: { $regex: q, $options: 'i' } },
          { hashtags: { $in: [new RegExp(q, 'i')] } },
        ],
      })
        .populate('author', 'buzzName handle avatar level xp')
        .sort({ createdAt: -1 })
        .limit(type === 'posts' ? limit : 6)
        .skip(type === 'posts' ? skip : 0);
      results.posts = posts;
    }

    results.total = results.users.length + results.posts.length;
    return results;
  }
}

module.exports = new SearchService();
