import { Schema, Types } from 'mongoose';
import { MessageSchema } from './message.schema';

export const ConversationSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User', // Jika Anda memiliki koleksi Users
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware untuk memperbarui updatedAt secara otomatis
ConversationSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
