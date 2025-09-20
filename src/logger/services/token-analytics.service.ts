import { Injectable } from '@nestjs/common';
import {
  TokenUsage,
  TokenCost,
  TokenAnalytics,
  OpenAIUsageData,
  ModelPricing,
  TokenReport,
} from '../interfaces/token-analytics.interface';

@Injectable()
export class TokenAnalyticsService {
  private readonly modelPricing: Record<string, ModelPricing> = {
    'gpt-4o': {
      input_cost_per_1k: 0.005,
      output_cost_per_1k: 0.015,
      currency: 'USD',
    },
    'gpt-4o-mini': {
      input_cost_per_1k: 0.00015,
      output_cost_per_1k: 0.0006,
      currency: 'USD',
    },
    'gpt-4-turbo': {
      input_cost_per_1k: 0.01,
      output_cost_per_1k: 0.03,
      currency: 'USD',
    },
    'gpt-4': {
      input_cost_per_1k: 0.03,
      output_cost_per_1k: 0.06,
      currency: 'USD',
    },
    'gpt-3.5-turbo': {
      input_cost_per_1k: 0.0005,
      output_cost_per_1k: 0.0015,
      currency: 'USD',
    },
    'text-embedding-3-small': {
      input_cost_per_1k: 0.00002,
      output_cost_per_1k: 0,
      currency: 'USD',
    },
    'text-embedding-3-large': {
      input_cost_per_1k: 0.00013,
      output_cost_per_1k: 0,
      currency: 'USD',
    },
  };

  /**
   * Calculate token cost based on usage and model
   */
  calculateTokenCost(
    usage: TokenUsage,
    model: string,
  ): TokenCost {
    const pricing = this.modelPricing[model];
    
    if (!pricing) {
      console.warn(`Pricing not found for model: ${model}. Using default GPT-4o pricing.`);
      const defaultPricing = this.modelPricing['gpt-4o'];
      return this.computeCost(usage, defaultPricing);
    }

    return this.computeCost(usage, pricing);
  }

  private computeCost(usage: TokenUsage, pricing: ModelPricing): TokenCost {
    const prompt_cost = (usage.prompt_tokens / 1000) * pricing.input_cost_per_1k;
    const completion_cost = (usage.completion_tokens / 1000) * pricing.output_cost_per_1k;
    const total_cost = prompt_cost + completion_cost;

    return {
      prompt_cost: Math.round(prompt_cost * 100000) / 100000, // Round to 5 decimal places
      completion_cost: Math.round(completion_cost * 100000) / 100000,
      total_cost: Math.round(total_cost * 100000) / 100000,
      currency: pricing.currency,
    };
  }

  /**
   * Create token analytics from OpenAI usage data
   */
  createTokenAnalytics(
    model: string,
    usageData: OpenAIUsageData,
    requestId?: string,
  ): TokenAnalytics {
    const usage: TokenUsage = {
      prompt_tokens: usageData.prompt_tokens || 0,
      completion_tokens: usageData.completion_tokens || 0,
      total_tokens: usageData.total_tokens || 0,
    };

    const cost = this.calculateTokenCost(usage, model);

    return {
      model,
      usage,
      cost,
      timestamp: new Date(),
      request_id: requestId,
    };
  }

  /**
   * Format token analytics for logging
   */
  formatTokenAnalytics(analytics: TokenAnalytics): string {
    const { model, usage, cost } = analytics;
    
    return [
      `🤖 Model: ${model}`,
      `📊 Tokens - Prompt: ${usage.prompt_tokens.toLocaleString()}, Completion: ${usage.completion_tokens.toLocaleString()}, Total: ${usage.total_tokens.toLocaleString()}`,
      `💰 Cost - Prompt: $${cost.prompt_cost.toFixed(5)}, Completion: $${cost.completion_cost.toFixed(5)}, Total: $${cost.total_cost.toFixed(5)} ${cost.currency}`,
      `⏰ Timestamp: ${analytics.timestamp.toISOString()}`,
    ].join('\n');
  }

  /**
   * Calculate total cost for multiple analytics records
   */
  calculateTotalCost(analyticsArray: TokenAnalytics[]): number {
    return analyticsArray.reduce((total, analytics) => {
      return total + analytics.cost.total_cost;
    }, 0);
  }

  /**
   * Calculate total tokens for multiple analytics records
   */
  calculateTotalTokens(analyticsArray: TokenAnalytics[]): number {
    return analyticsArray.reduce((total, analytics) => {
      return total + analytics.usage.total_tokens;
    }, 0);
  }

  /**
   * Get available models and their pricing
   */
  getModelPricing(): Record<string, ModelPricing> {
    return { ...this.modelPricing };
  }

  /**
   * Add or update model pricing
   */
  updateModelPricing(model: string, pricing: ModelPricing): void {
    this.modelPricing[model] = pricing;
  }

  /**
   * Generate token usage report
   */
  generateTokenReport(
    userId: string,
    analyticsArray: TokenAnalytics[],
    startDate: Date,
    endDate: Date,
  ): TokenReport {
    const modelBreakdown: TokenReport['model_breakdown'] = {};
    
    analyticsArray.forEach((analytics) => {
      const model = analytics.model;
      if (!modelBreakdown[model]) {
        modelBreakdown[model] = {
          requests: 0,
          tokens: 0,
          cost: 0,
        };
      }
      
      modelBreakdown[model].requests += 1;
      modelBreakdown[model].tokens += analytics.usage.total_tokens;
      modelBreakdown[model].cost += analytics.cost.total_cost;
    });

    return {
      user_id: userId,
      date_range: {
        start: startDate,
        end: endDate,
      },
      total_requests: analyticsArray.length,
      total_tokens: this.calculateTotalTokens(analyticsArray),
      total_cost: this.calculateTotalCost(analyticsArray),
      model_breakdown: modelBreakdown,
    };
  }
}
