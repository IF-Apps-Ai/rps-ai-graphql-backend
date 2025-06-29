import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from './interfaces/logger.interface';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LoggerService {
  private logBuffer: Array<{ user_id: string; response: any }> = [];
  private readonly maxBufferSize = 100;

  constructor(
    @InjectModel('Logger', 'MONGODB_CONNECTION')
    private readonly loggerModel: Model<Logger>,
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

  async saveLogBatch(
    logs: Array<{ user_id: string; response: any }>,
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
}
