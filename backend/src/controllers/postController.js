'use strict';

const postService = require('../services/postService');
const { sendSuccess, sendCreated, sendPaginated } = require('../utils/response');
const { getPaginationOptions } = require('../utils/pagination');

class PostController {
  async createPost(req, res, next) {
    try {
      const post = await postService.createPost(req.user._id, req.body);
      sendCreated(res, { data: post, message: 'Post created' });
    } catch (error) {
      next(error);
    }
  }

  async getFeed(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationOptions(req.query);
      const { posts, total } = await postService.getFeed(skip, limit);
      sendPaginated(res, { data: posts, page, limit, total });
    } catch (error) {
      next(error);
    }
  }

  async getPostById(req, res, next) {
    try {
      const post = await postService.getPostById(req.params.id);
      sendSuccess(res, { data: post });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req, res, next) {
    try {
      await postService.deletePost(req.params.id, req.user._id);
      sendSuccess(res, { message: 'Post deleted' });
    } catch (error) {
      next(error);
    }
  }

  async likePost(req, res, next) {
    try {
      const post = await postService.likePost(req.params.id, req.user._id);
      sendSuccess(res, { data: post, message: 'Post liked' });
    } catch (error) {
      next(error);
    }
  }

  async unlikePost(req, res, next) {
    try {
      const post = await postService.unlikePost(req.params.id, req.user._id);
      sendSuccess(res, { data: post, message: 'Post unliked' });
    } catch (error) {
      next(error);
    }
  }

  async createComment(req, res, next) {
    try {
      const comment = await postService.createComment(req.params.id, req.user._id, req.body.content);
      sendCreated(res, { data: comment, message: 'Comment added' });
    } catch (error) {
      next(error);
    }
  }

  async getComments(req, res, next) {
    try {
      const { page, limit, skip } = getPaginationOptions(req.query);
      const { comments, total } = await postService.getComments(req.params.id, skip, limit);
      sendPaginated(res, { data: comments, page, limit, total });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
