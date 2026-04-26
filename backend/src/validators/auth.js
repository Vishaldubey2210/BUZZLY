'use strict';

const { z } = require('zod');

const signupSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email format'),
    password: z.string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
    buzzName: z.string({ required_error: 'Display name is required' })
      .min(2, 'Name must be at least 2 characters'),
    handle: z.string({ required_error: 'Handle is required' })
      .min(3, 'Handle must be at least 3 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
};
