import { Document } from 'mongoose';

export interface Metadata {
  request_id: string;
  model: string;
  temperature: number;
  max_completion_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  usage?: any;
  timestamp: string;
}

export interface ContentElement {
  type: string;
  text: string;
}

export interface Message {
  // ID tidak perlu didefinisikan karena Mongoose menyediakan _id (yang nantinya di-mapping ke id di model GraphQL)
  role: 'system' | 'user' | 'assistant';
  content: ContentElement[]; // disesuaikan dengan model (array ContentElement)
  timestamp: Date;
  metadata?: Metadata;
}

export interface Conversation extends Document {
  userId?: string;
  title?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
