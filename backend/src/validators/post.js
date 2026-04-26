'use strict';

const { z } = require('zod');

const createPostSchema = z.object({
  body: z.object({
    content: z.string({ required_error: 'Content is required' })
      .min(1, 'Content cannot be empty')
      .max(1000, 'Content must not exceed 1000 characters'),
    drinkCategory: z.enum(['beer', 'wine', 'spirit', 'cocktail', 'na']).optional(),
    vibeTag: z.string().optional(),
    image: z.string().url().optional().nullable(),
  }),
});

const createCommentSchema = z.object({
  body: z.object({
    content: z.string({ required_error: 'Content is required' })
      .min(1, 'Content cannot be empty')
      .max(500, 'Content must not exceed 500 characters'),
  }),
});

module.exports = {
  createPostSchema,
  createCommentSchema,
};
