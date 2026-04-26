'use strict';

const Post = require('../models/Post');
const Comment = require('../models/Comment');

class PostService {
  async createPost(userId, data) {
    const post = await Post.create({
      ...data,
      author: userId,
    });
    return post.populate('author', 'buzzName handle avatar level');
  }

  async getFeed(skip, limit) {
    const posts = await Post.find()
      .populate('author', 'buzzName handle avatar level')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Post.countDocuments();
    return { posts, total };
  }

  async getPostById(postId) {
    const post = await Post.findById(postId).populate('author', 'buzzName handle avatar level');
    if (!post) throw new Error('Post not found');
    return post;
  }

  async deletePost(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');
    
    if (post.author.toString() !== userId.toString()) {
      throw new Error('Not authorized to delete this post');
    }
    
    await post.deleteOne();
    // Cleanup comments
    await Comment.deleteMany({ post: postId });
    return true;
  }

  async likePost(postId, userId) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');

    if (post.likes.includes(userId)) {
      throw new Error('Post already liked');
    }

    post.likes.push(userId);
    await post.save();
    return post;
  }

  async unlikePost(postId, userId) {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!post) throw new Error('Post not found');
    return post;
  }

  async createComment(postId, userId, content) {
    const post = await Post.findById(postId);
    if (!post) throw new Error('Post not found');

    const comment = await Comment.create({
      post: postId,
      author: userId,
      content,
    });

    post.commentCount += 1;
    await post.save();

    return comment.populate('author', 'buzzName handle avatar');
  }

  async getComments(postId, skip, limit) {
    const comments = await Comment.find({ post: postId })
      .populate('author', 'buzzName handle avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ post: postId });
    return { comments, total };
  }
}

module.exports = new PostService();
