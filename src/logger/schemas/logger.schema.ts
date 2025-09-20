import { Schema } from 'mongoose';

export const TokenUsageSchema = new Schema({
  prompt_tokens: { type: Number, required: true },
  completion_tokens: { type: Number, required: true },
  total_tokens: { type: Number, required: true },
});

export const TokenCostSchema = new Schema({
  prompt_cost: { type: Number, required: true },
  completion_cost: { type: Number, required: true },
  total_cost: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
});

export const TokenAnalyticsSchema = new Schema({
  model: { type: String, required: true },
  usage: { type: TokenUsageSchema, required: true },
  cost: { type: TokenCostSchema, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  request_id: { type: String },
});

export const LoggerSchema = new Schema(
  {
    user_id: { type: String, required: true },
    response: { type: Schema.Types.Mixed, required: true },
    token_analytics: { type: TokenAnalyticsSchema },
  },
  { timestamps: true },
);
