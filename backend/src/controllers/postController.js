'use strict';

const postService = require('../services/postService');
const { sendSuccess, sendCreated, sendPaginated } = require('../utils/response');
const { getPaginationOptions } = require('../utils/pagination');

const getIo = () => { try { return require('../sockets').getIo(); } catch { return null; } };

class PostController {
  async createPost(req, res, next) {
    try {
      const post = await postService.createPost(req.user._id, req.body, getIo());
      sendCreated(res, { data: post, message: 'Post created' });
    } catch (error) { next(error); }
  }

  async getFeed(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationOptions(req.query);
      const category = req.query.category || 'all';
      const feedType = req.query.feedType || 'recent';
      const { posts, total } = await postService.getFeed(skip, limit, category, feedType, req.user._id);
      sendPaginated(res, { data: posts, page, limit, total });
    } catch (error) { next(error); }
  }

  async getUserPosts(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationOptions(req.query);
      const { posts, total } = await postService.getUserPosts(req.params.userId, skip, limit);
      sendPaginated(res, { data: posts, page, limit, total });
    } catch (error) { next(error); }
  }

  async getPostById(req, res, next) {
    try {
      const post = await postService.getPostById(req.params.id);
      sendSuccess(res, { data: post });
    } catch (error) { next(error); }
  }

  async deletePost(req, res, next) {
    try {
      await postService.deletePost(req.params.id, req.user._id);
      sendSuccess(res, { message: 'Post deleted' });
    } catch (error) { next(error); }
  }

  async updatePost(req, res, next) {
    try {
      const post = await postService.updatePost(req.params.id, req.user._id, req.body);
      sendSuccess(res, { data: post, message: 'Post updated' });
    } catch (error) { next(error); }
  }

  async reportPost(req, res, next) {
    try {
      await postService.reportPost(req.params.id, req.user._id, req.body.reason);
      sendSuccess(res, { message: 'Post reported successfully. Our team will review it.' });
    } catch (error) { next(error); }
  }

  async likePost(req, res, next) {
    try {
      const post = await postService.likePost(req.params.id, req.user._id, getIo());
      sendSuccess(res, { data: post, message: 'Post liked' });
    } catch (error) { next(error); }
  }

  async unlikePost(req, res, next) {
    try {
      const post = await postService.unlikePost(req.params.id, req.user._id);
      sendSuccess(res, { data: post, message: 'Post unliked' });
    } catch (error) { next(error); }
  }

  async savePost(req, res, next) {
    try {
      const result = await postService.savePost(req.params.id, req.user._id);
      sendSuccess(res, { data: result, message: result.saved ? 'Post saved' : 'Post unsaved' });
    } catch (error) { next(error); }
  }

  async getSavedPosts(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationOptions(req.query);
      const { posts, total } = await postService.getSavedPosts(req.user._id, skip, limit);
      sendPaginated(res, { data: posts, page, limit, total });
    } catch (error) { next(error); }
  }

  async repost(req, res, next) {
    try {
      const post = await postService.repost(req.params.id, req.user._id, req.body.comment, getIo());
      sendCreated(res, { data: post, message: 'Reposted!' });
    } catch (error) { next(error); }
  }

  async createComment(req, res, next) {
    try {
      const comment = await postService.createComment(req.params.id, req.user._id, req.body.content, getIo());
      sendCreated(res, { data: comment, message: 'Comment added' });
    } catch (error) { next(error); }
  }

  async getComments(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationOptions(req.query);
      const { comments, total } = await postService.getComments(req.params.id, skip, limit);
      sendPaginated(res, { data: comments, page, limit, total });
    } catch (error) { next(error); }
  }
}

module.exports = new PostController();
