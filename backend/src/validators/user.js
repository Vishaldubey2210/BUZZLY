'use strict';

const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z.object({
    buzzName: z.string().min(2, 'Name must be at least 2 characters').optional(),
    bio: z.string().max(160, 'Bio must not exceed 160 characters').optional(),
    city: z.string().optional(),
    drinkPreferences: z.array(z.enum(['beer', 'wine', 'spirit', 'cocktail', 'na'])).optional(),
    avatar: z.string().url().optional(),
  }),
});

module.exports = {
  updateProfileSchema,
};
