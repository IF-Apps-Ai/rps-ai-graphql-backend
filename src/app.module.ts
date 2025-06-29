import { Module } from '@nestjs/common';
import { RpsModule } from './rps/rps.module';
import { CommonModule } from './common/common.module';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DosenModule } from './dosen/dosen.module';
import { BahanAjarModule } from './bahan-ajar/bahan-ajar.module';
import { SettingsModule } from './settings/settings.module';
import { ConversationsModule } from './conversations/conversations.module';
import { CompletionModule } from './completion/completion.module';
import { LoggerModule } from './logger/logger.module';
import { HealthModule } from './health/health.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from './common/cache.module';
import { SecurityModule } from './common/security.module';
import { GraphQLThrottlerGuard } from './common/guards/graphql-throttler.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ...(process.env.LOGGER_MONGO_URI
      ? [
          MongooseModule.forRoot(process.env.LOGGER_MONGO_URI.trim(), {
            connectionName: 'MONGODB_CONNECTION',
          }),
        ]
      : []),
    CacheModule,
    SecurityModule,
    CommonModule,
    DatabaseModule,
    LoggerModule,
    ConversationsModule,
    UserModule,
    AuthModule,
    RpsModule,
    DosenModule,
    BahanAjarModule,
    SettingsModule,
    CompletionModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppResolver,
    AppService,
    {
      provide: APP_GUARD,
      useClass: GraphQLThrottlerGuard,
    },
  ],
})
export class AppModule {}
