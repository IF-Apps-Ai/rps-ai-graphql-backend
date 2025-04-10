import { Schema } from 'mongoose';

export const ContentElementSchema = new Schema(
  {
    type: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false },
);

export const MetadataSchema = new Schema(
  {
    request_id: { type: String, required: true },
    model: { type: String, required: true },
    temperature: { type: Number, required: true },
    max_completion_tokens: { type: Number, required: true },
    top_p: { type: Number, required: true },
    frequency_penalty: { type: Number, required: true },
    presence_penalty: { type: Number, required: true },
    usage: { type: Schema.Types.Mixed, required: false },
    timestamp: { type: String, required: true },
  },
  { _id: false },
);

export const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['system', 'user', 'assistant'],
      required: true,
    },
    content: {
      type: [ContentElementSchema],
      required: true,
    },
    metadata: {
      type: MetadataSchema,
      required: false,
    },
  },
  { _id: true },
);
