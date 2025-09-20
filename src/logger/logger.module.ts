import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { TokenAnalyticsService } from './services/token-analytics.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerSchema } from './schemas/logger.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature(
      [{ name: 'Logger', schema: LoggerSchema }],
      'MONGODB_CONNECTION',
    ),
  ],
  providers: [LoggerService, TokenAnalyticsService],
  exports: [LoggerService, TokenAnalyticsService],
})
export class LoggerModule {}
