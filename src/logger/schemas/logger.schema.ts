import { Schema } from 'mongoose';

export const LoggerSchema = new Schema(
  {
    user_id: { type: String, required: true },
    response: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);
