import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from './interfaces/logger.interface';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel('Logger', 'MONGODB_CONNECTION')
    private readonly loggerModel: Model<Logger>,
  ) {}

  async saveLog(user_id: string, response: any): Promise<Logger> {
    const newLog = new this.loggerModel({ user_id, response });
    return await newLog.save();
  }
}
