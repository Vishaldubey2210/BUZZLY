'use strict';

const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Connection = require('../models/Connection');
const Notification = require('../models/Notification');

// Award XP and level-up
const awardXp = async (userId, amount) => {
  const user = await User.findByIdAndUpdate(userId, { $inc: { xp: amount } }, { new: true });
  if (user) {
    const newLevel = Math.floor(user.xp / 1000) + 1;
    if (newLevel > user.level) await User.findByIdAndUpdate(userId, { level: newLevel });
  }
};

// Save notification + emit via socket
const pushNotification = async (io, notifData) => {
  try {
    const notif = await Notification.create(notifData);
    const populated = await notif.populate('sender', 'buzzName avatar');
    if (io) io.to(notifData.recipient.toString()).emit('new_notification', populated);
  } catch {}
};

// Extract hashtags from content
const extractHashtags = (content) => {
  const matches = content.match(/#[a-zA-Z0-9]+/g) || [];
  return matches.map(t => t.slice(1).toLowerCase());
};

class PostService {
  async createPost(userId, data, io) {
    const hashtags = extractHashtags(data.content || '');
    const post = await Post.create({ ...data, author: userId, hashtags });
    await awardXp(userId, 50);
    await this._checkBadges(userId, 'post');
    const populated = await Post.findById(post._id).populate('author', 'buzzName handle avatar level xp');
    return populated;
  }

  async getFeed(skip, limit, category, feedType = 'recent', currentUserId) {
    const filter = {};
    if (category && category !== 'all') filter.drinkCategory = category;

    let sortOrder = { createdAt: -1 };

    if (feedType === 'trending') {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      filter.createdAt = { $gte: since };
      // Sort by likes count — use aggregation
      const posts = await Post.aggregate([
        { $match: filter },
        { $addFields: { likeCount: { $size: '$likes' } } },
        { $sort: { likeCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);
      const total = await Post.countDocuments(filter);
      const populated = await Post.populate(posts, { path: 'author', select: 'buzzName handle avatar level xp' });
      return { posts: populated, total };
    }

    if (feedType === 'following' && currentUserId) {
      // Get connections
      const connections = await Connection.find({
        $or: [{ requester: currentUserId }, { recipient: currentUserId }],
        status: 'accepted',
      });
      const friendIds = connections.map(c =>
        c.requester.toString() === currentUserId.toString() ? c.recipient : c.requester
      );
      // Also include following
      const me = await User.findById(currentUserId).select('following');
      const allIds = [...new Set([...friendIds.map(String), ...(me?.following || []).map(String)])];
      if (allIds.length > 0) filter.author = { $in: allIds };
    }

    const posts = await Post.find(filter)
      .populate('author', 'buzzName handle avatar level xp')
      .populate({ path: 'repostOf', populate: { path: 'author', select: 'buzzName handle avatar level xp' } })
      .sort(sortOrder)
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);
    return { posts, total };
  }

  async getUserPosts(userId, skip, limit) {
    const posts = await Post.find({ author: userId, repostOf: null })
      .populate('author', 'buzzName handle avatar level xp')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Post.countDocuments({ author: userId, repostOf: null });
    return { posts, total };
  }

  async getPostById(postId) {
    const post = await Post.findById(postId)
      .populate('author', 'buzzName handle avatar level xp bio headline')
      .populate({ path: 'repostOf', populate: { path: 'author', select: 'buzzName handle avatar level xp' } });
    if (!post) throw new Error('Post not found');
    return post;
  }

  async deletePost(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    if (post.author.toString() !== userId.toString()) throw new Error('Not authorized');
    await post.deleteOne();
    await Comment.deleteMany({ post: postId });
    return true;
  }

  async updatePost(postId, userId, data) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    if (post.author.toString() !== userId.toString()) throw new Error('Not authorized');
    
    post.content = data.content || post.content;
    post.vibeTag = data.vibeTag || post.vibeTag;
    post.drinkCategory = data.drinkCategory || post.drinkCategory;
    post.hashtags = extractHashtags(post.content);
    
    await post.save();
    return post;
  }

  async reportPost(postId, userId, reason) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    // In a real app we'd save to a Report collection
    post.isReported = true;
    await post.save();
    return true;
  }

  async likePost(postId, userId, io) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    if (post.likes.includes(userId)) throw new Error('Already liked');
    post.likes.push(userId);
    await post.save();
    if (post.author.toString() !== userId.toString()) {
      await awardXp(post.author, 5);
      await pushNotification(io, {
        recipient: post.author, sender: userId, type: 'like',
        content: 'liked your post ❤️', referenceId: post._id,
      });
    }
    return post;
  }

  async unlikePost(postId, userId) {
    const post = await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
    if (!post) throw new Error('Post not found');
    return post;
  }

  async savePost(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    const saved = post.saves.includes(userId);
    if (saved) {
      post.saves.pull(userId);
      await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
    } else {
      post.saves.push(userId);
      await User.findByIdAndUpdate(userId, { $addToSet: { savedPosts: postId } });
    }
    await post.save();
    return { saved: !saved, saveCount: post.saves.length };
  }

  async getSavedPosts(userId, skip, limit) {
    const user = await User.findById(userId).populate({
      path: 'savedPosts',
      populate: { path: 'author', select: 'buzzName handle avatar level xp' },
      options: { sort: { createdAt: -1 }, skip, limit },
    });
    return { posts: user?.savedPosts || [], total: user?.savedPosts?.length || 0 };
  }

  async repost(postId, userId, comment, io) {
    const originalPost = await Post.findById(postId);
    if (!originalPost) throw new Error('Post not found');

    const repost = await Post.create({
      content: comment || '',
      author: userId,
      repostOf: postId,
      repostComment: comment || '',
      drinkCategory: originalPost.drinkCategory,
    });

    originalPost.reposts.push(userId);
    await originalPost.save();
    await awardXp(userId, 20);

    if (originalPost.author.toString() !== userId.toString()) {
      await pushNotification(io, {
        recipient: originalPost.author, sender: userId, type: 'repost',
        content: 'reposted your post 🔄', referenceId: originalPost._id,
      });
    }

    return repost.populate('author', 'buzzName handle avatar level xp');
  }

  async createComment(postId, userId, content, io) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    const comment = await Comment.create({ post: postId, author: userId, content });
    post.commentCount += 1;
    await post.save();
    await awardXp(userId, 10);
    if (post.author.toString() !== userId.toString()) {
      await awardXp(post.author, 5);
      await pushNotification(io, {
        recipient: post.author, sender: userId, type: 'comment',
        content: 'commented on your post 💬', referenceId: post._id,
      });
    }
    return comment.populate('author', 'buzzName handle avatar');
  }

  async getComments(postId, skip, limit) {
    const comments = await Comment.find({ post: postId })
      .populate('author', 'buzzName handle avatar level')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Comment.countDocuments({ post: postId });
    return { comments, total };
  }

  // Badge logic
  async _checkBadges(userId, action) {
    const user = await User.findById(userId);
    if (!user) return;
    const newBadges = [];
    const hasBadge = (id) => user.badges.some(b => b.id === id);

    if (action === 'post') {
      const postCount = await Post.countDocuments({ author: userId });
      if (postCount >= 1 && !hasBadge('first_post')) newBadges.push({ id: 'first_post', name: 'First Pour', icon: '🍺' });
      if (postCount >= 10 && !hasBadge('ten_posts')) newBadges.push({ id: 'ten_posts', name: 'Buzz Starter', icon: '🌟' });
      if (postCount >= 50 && !hasBadge('fifty_posts')) newBadges.push({ id: 'fifty_posts', name: 'Social Brewer', icon: '🏆' });
    }

    if (user.xp >= 1000 && !hasBadge('xp_1000')) newBadges.push({ id: 'xp_1000', name: 'Rising Star', icon: '⭐' });
    if (user.xp >= 5000 && !hasBadge('xp_5000')) newBadges.push({ id: 'xp_5000', name: 'Buzz Legend', icon: '👑' });

    if (newBadges.length > 0) {
      await User.findByIdAndUpdate(userId, { $push: { badges: { $each: newBadges } } });
    }
  }
}

module.exports = new PostService();
