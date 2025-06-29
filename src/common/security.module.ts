import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          name: 'short',
          ttl: 1000, // 1 second
          limit: 3, // max 3 requests per second
        },
        {
          name: 'medium',
          ttl: 10000, // 10 seconds
          limit: 20, // max 20 requests per 10 seconds
        },
        {
          name: 'long',
          ttl: 60000, // 1 minute
          limit: 100, // max 100 requests per minute
        },
        {
          name: 'ai-generation',
          ttl: 60000, // 1 minute
          limit: parseInt(configService.get('AI_RATE_LIMIT') || '10'), // AI generation limit
        },
      ],
    }),
  ],
})
export class SecurityModule {}
