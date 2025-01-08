import { Schema, Types } from 'mongoose';

export const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ['system', 'user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
