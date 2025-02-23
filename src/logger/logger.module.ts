import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerSchema } from './schemas/logger.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Logger', schema: LoggerSchema }]),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
