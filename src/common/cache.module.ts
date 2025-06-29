import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        return {
          ttl: 300, // 5 minutes default TTL
          max: 1000, // Maximum number of items in cache
          isGlobal: true,
        };
      },
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
