import { TokenAnalytics } from './token-analytics.interface';

export interface Logger {
  user_id: string;
  response: any;
  token_analytics?: TokenAnalytics;
  createdAt?: Date;
  updatedAt?: Date;
}
