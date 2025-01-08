import { Document, Types } from 'mongoose';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation extends Document {
  userId?: Types.ObjectId;
  title?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
