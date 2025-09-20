import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from './interfaces/logger.interface';
import { TokenAnalytics, OpenAIUsageData, TokenReport } from './interfaces/token-analytics.interface';
import { TokenAnalyticsService } from './services/token-analytics.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LoggerService {
  private logBuffer: Array<{ user_id: string; response: any; token_analytics?: TokenAnalytics }> = [];
  private readonly maxBufferSize = 100;

  constructor(
    @InjectModel('Logger', 'MONGODB_CONNECTION')
    private readonly loggerModel: Model<Logger>,
    private readonly tokenAnalyticsService: TokenAnalyticsService,
  ) {}

  async saveLog(user_id: string, response: any): Promise<Logger> {
    // Add to buffer for batch processing
    this.logBuffer.push({ user_id, response });

    // If buffer is full, flush immediately
    if (this.logBuffer.length >= this.maxBufferSize) {
      await this.flushLogs();
    }

    // For immediate logging needs, save directly
    const newLog = new this.loggerModel({ user_id, response });
    return await newLog.save();
  }

  /**
   * Save log with OpenAI token analytics
   */
  async saveLogWithTokens(
    user_id: string,
    response: any,
    model: string,
    usageData: OpenAIUsageData,
    requestId?: string,
  ): Promise<Logger> {
    // Create token analytics
    const tokenAnalytics = this.tokenAnalyticsService.createTokenAnalytics(
      model,
      usageData,
      requestId,
    );

    // Log token usage info
    console.log(`📊 Token Usage - User: ${user_id}`);
    console.log(this.tokenAnalyticsService.formatTokenAnalytics(tokenAnalytics));

    // Add to buffer for batch processing
    this.logBuffer.push({ user_id, response, token_analytics: tokenAnalytics });

    // If buffer is full, flush immediately
    if (this.logBuffer.length >= this.maxBufferSize) {
      await this.flushLogs();
    }

    // For immediate logging needs, save directly
    const newLog = new this.loggerModel({
      user_id,
      response,
      token_analytics: tokenAnalytics,
    });
    return await newLog.save();
  }

  async saveLogBatch(
    logs: Array<{ user_id: string; response: any; token_analytics?: TokenAnalytics }>,
  ): Promise<Logger[]> {
    const logDocuments = logs.map((log) => new this.loggerModel(log));
    return await this.loggerModel.insertMany(logDocuments);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    try {
      const logsToFlush = [...this.logBuffer];
      this.logBuffer = []; // Clear buffer

      await this.saveLogBatch(logsToFlush);
      console.log(`✅ Flushed ${logsToFlush.length} logs to database`);
    } catch (error) {
      console.error('❌ Error flushing logs:', error);
      // Restore logs to buffer on error
      this.logBuffer.unshift(...this.logBuffer);
    }
  }

  async getLogsByUser(user_id: string, limit = 50): Promise<Logger[]> {
    return await this.loggerModel
      .find({ user_id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getLogsStats(): Promise<any> {
    return await this.loggerModel.aggregate([
      {
        $group: {
          _id: '$user_id',
          count: { $sum: 1 },
          lastActivity: { $max: '$createdAt' },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);
  }

  /**
   * Get token usage statistics for a user
   */
  async getTokenUsageStats(user_id: string, days = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.loggerModel.aggregate([
      {
        $match: {
          user_id,
          createdAt: { $gte: startDate },
          'token_analytics.usage.total_tokens': { $exists: true },
        },
      },
      {
        $group: {
          _id: '$token_analytics.model',
          total_requests: { $sum: 1 },
          total_tokens: { $sum: '$token_analytics.usage.total_tokens' },
          total_cost: { $sum: '$token_analytics.cost.total_cost' },
          avg_tokens_per_request: { $avg: '$token_analytics.usage.total_tokens' },
          max_tokens_per_request: { $max: '$token_analytics.usage.total_tokens' },
        },
      },
      {
        $sort: { total_cost: -1 },
      },
    ]);
  }

  /**
   * Generate token usage report
   */
  async generateTokenReport(user_id: string, days = 30): Promise<TokenReport> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.loggerModel.find({
      user_id,
      createdAt: { $gte: startDate, $lte: endDate },
      'token_analytics.usage.total_tokens': { $exists: true },
    }).exec();

    const analyticsArray = logs
      .map(log => log.token_analytics)
      .filter(analytics => analytics != null);

    return this.tokenAnalyticsService.generateTokenReport(
      user_id,
      analyticsArray,
      startDate,
      endDate,
    );
  }

  /**
   * Get top token consuming users
   */
  async getTopTokenUsers(days = 30, limit = 10): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.loggerModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'token_analytics.usage.total_tokens': { $exists: true },
        },
      },
      {
        $group: {
          _id: '$user_id',
          total_requests: { $sum: 1 },
          total_tokens: { $sum: '$token_analytics.usage.total_tokens' },
          total_cost: { $sum: '$token_analytics.cost.total_cost' },
          models_used: { $addToSet: '$token_analytics.model' },
        },
      },
      {
        $sort: { total_cost: -1 },
      },
      {
        $limit: limit,
      },
    ]);
  }

  /**
   * Get daily token usage trends
   */
  async getDailyTokenTrends(days = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.loggerModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'token_analytics.usage.total_tokens': { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          total_requests: { $sum: 1 },
          total_tokens: { $sum: '$token_analytics.usage.total_tokens' },
          total_cost: { $sum: '$token_analytics.cost.total_cost' },
          unique_users: { $addToSet: '$user_id' },
        },
      },
      {
        $addFields: {
          unique_user_count: { $size: '$unique_users' },
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
          },
        },
      },
      {
        $sort: { date: 1 },
      },
      {
        $project: {
          _id: 0,
          date: 1,
          total_requests: 1,
          total_tokens: 1,
          total_cost: 1,
          unique_user_count: 1,
        },
      },
    ]);
  }
}
