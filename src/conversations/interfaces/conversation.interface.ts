import { Document, Types } from 'mongoose';

export interface Metadata {
  request_id: string;
  model: string;
  temperature: number;
  max_completion_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  prompt_tokens_used: number;
  completion_tokens_used: number;
  timestamp: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: Metadata;
}

export interface Conversation extends Document {
  userId?: Types.ObjectId;
  title?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
