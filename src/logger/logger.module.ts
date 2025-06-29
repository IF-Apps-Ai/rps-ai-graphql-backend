import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
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
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
