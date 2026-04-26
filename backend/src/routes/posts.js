'use strict';

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createPostSchema, createCommentSchema } = require('../validators/post');

router.use(protect);

router.route('/')
  .get(postController.getFeed)
  .post(postController.createPost);

router.get('/saved', postController.getSavedPosts);
router.get('/user/:userId', postController.getUserPosts);

router.route('/:id')
  .get(postController.getPostById)
  .put(postController.updatePost)
  .delete(postController.deletePost);

router.post('/:id/report', postController.reportPost);

router.route('/:id/like')
  .post(postController.likePost)
  .delete(postController.unlikePost);

router.route('/:id/save')
  .post(postController.savePost)
  .delete(postController.savePost);

router.post('/:id/repost', postController.repost);

router.route('/:id/comments')
  .get(postController.getComments)
  .post(validate(createCommentSchema), postController.createComment);

module.exports = router;
