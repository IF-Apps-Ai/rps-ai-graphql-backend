export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface TokenCost {
  prompt_cost: number;
  completion_cost: number;
  total_cost: number;
  currency: string;
}

export interface TokenAnalytics {
  model: string;
  usage: TokenUsage;
  cost: TokenCost;
  timestamp: Date;
  request_id?: string;
}

export interface OpenAIUsageData {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ModelPricing {
  input_cost_per_1k: number;  // Cost per 1,000 input tokens
  output_cost_per_1k: number; // Cost per 1,000 output tokens
  currency: string;
}

export interface TokenReport {
  user_id: string;
  date_range: {
    start: Date;
    end: Date;
  };
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  model_breakdown: {
    [model: string]: {
      requests: number;
      tokens: number;
      cost: number;
    };
  };
}
