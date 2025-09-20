import { Controller, Get, Query, Param } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { TokenAnalyticsService } from '../logger/services/token-analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly tokenAnalyticsService: TokenAnalyticsService,
  ) {}

  @Get('token-usage/:userId')
  async getTokenUsageStats(
    @Param('userId') userId: string,
    @Query('days') days = '30',
  ) {
    const daysNumber = parseInt(days, 10);
    
    const stats = await this.loggerService.getTokenUsageStats(userId, daysNumber);
    const report = await this.loggerService.generateTokenReport(userId, daysNumber);
    
    return {
      user_id: userId,
      period_days: daysNumber,
      summary: report,
      detailed_stats: stats,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('token-report/:userId')
  async getTokenReport(
    @Param('userId') userId: string,
    @Query('days') days = '30',
  ) {
    const daysNumber = parseInt(days, 10);
    const report = await this.loggerService.generateTokenReport(userId, daysNumber);
    
    return {
      ...report,
      generated_at: new Date().toISOString(),
    };
  }

  @Get('top-users')
  async getTopTokenUsers(@Query('days') days = '30', @Query('limit') limit = '10') {
    const daysNumber = parseInt(days, 10);
    const limitNumber = parseInt(limit, 10);
    
    const topUsers = await this.loggerService.getTopTokenUsers(daysNumber, limitNumber);
    
    return {
      period_days: daysNumber,
      limit: limitNumber,
      top_users: topUsers,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('daily-trends')
  async getDailyTokenTrends(@Query('days') days = '30') {
    const daysNumber = parseInt(days, 10);
    const trends = await this.loggerService.getDailyTokenTrends(daysNumber);
    
    return {
      period_days: daysNumber,
      trends,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('pricing')
  async getModelPricing() {
    const pricing = this.tokenAnalyticsService.getModelPricing();
    
    return {
      pricing,
      last_updated: new Date().toISOString(),
      currency: 'USD',
      note: 'Prices are per 1,000 tokens',
    };
  }

  @Get('overview')
  async getAnalyticsOverview(@Query('days') days = '30') {
    const daysNumber = parseInt(days, 10);
    
    const [topUsers, dailyTrends] = await Promise.all([
      this.loggerService.getTopTokenUsers(daysNumber, 5),
      this.loggerService.getDailyTokenTrends(daysNumber),
    ]);

    // Calculate totals
    const totalStats = dailyTrends.reduce(
      (acc, day) => {
        acc.total_requests += day.total_requests;
        acc.total_tokens += day.total_tokens;
        acc.total_cost += day.total_cost;
        acc.unique_users.add(...day.unique_user_count ? [day.unique_user_count] : []);
        return acc;
      },
      {
        total_requests: 0,
        total_tokens: 0,
        total_cost: 0,
        unique_users: new Set(),
      },
    );

    return {
      period_days: daysNumber,
      summary: {
        total_requests: totalStats.total_requests,
        total_tokens: totalStats.total_tokens,
        total_cost: Math.round(totalStats.total_cost * 100000) / 100000,
        unique_users: dailyTrends.reduce((sum, day) => sum + (day.unique_user_count || 0), 0),
        avg_tokens_per_request: totalStats.total_requests > 0 
          ? Math.round(totalStats.total_tokens / totalStats.total_requests)
          : 0,
        avg_cost_per_request: totalStats.total_requests > 0
          ? Math.round((totalStats.total_cost / totalStats.total_requests) * 100000) / 100000
          : 0,
      },
      top_users: topUsers.slice(0, 5),
      daily_trends: dailyTrends,
      timestamp: new Date().toISOString(),
    };
  }
}
