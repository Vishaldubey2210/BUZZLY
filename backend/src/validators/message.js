'use strict';

const { z } = require('zod');

const sendMessageSchema = z.object({
  body: z.object({
    text: z.string({ required_error: 'Message text is required' })
      .min(1, 'Message cannot be empty')
      .max(2000, 'Message is too long'),
  }),
});

module.exports = {
  sendMessageSchema,
};
