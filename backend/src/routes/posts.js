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
  .post(validate(createPostSchema), postController.createPost);

router.route('/:id')
  .get(postController.getPostById)
  .delete(postController.deletePost);

router.route('/:id/like')
  .post(postController.likePost)
  .delete(postController.unlikePost);

router.route('/:id/comments')
  .get(postController.getComments)
  .post(validate(createCommentSchema), postController.createComment);

module.exports = router;
