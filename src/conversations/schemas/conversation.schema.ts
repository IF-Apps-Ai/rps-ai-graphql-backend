import { Schema } from 'mongoose';
import { MessageSchema } from './message.schema';

export const ConversationSchema = new Schema({
  userId: { type: String, required: false },
  title: {
    type: String,
    required: false,
  },
  // Menyimpan pesan sebagai subdokumen dengan MessageSchema
  messages: {
    type: [MessageSchema],
    required: true,
    default: [],
  },
  model: {
    type: String,
    required: false,
  },
  max_tokens: {
    type: Number,
    required: false,
  },
  temperature: {
    type: Number,
    required: false,
  },
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
