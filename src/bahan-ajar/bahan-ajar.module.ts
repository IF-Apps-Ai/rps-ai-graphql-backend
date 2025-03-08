import { Module } from '@nestjs/common';
import { BahanAjarService } from './bahan-ajar.service';
import { BahanAjarResolver } from './bahan-ajar.resolver';
import { SettingsModule } from 'src/settings/settings.module';
import { SettingsService } from 'src/settings/settings.service';
import { LoggerModule } from '../logger/logger.module';
import { DatabaseModule } from 'src/database/database.module';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [DatabaseModule, SettingsModule, LoggerModule, ConversationsModule],
  providers: [BahanAjarService, BahanAjarResolver, SettingsService],
  exports: [BahanAjarService],
})
export class BahanAjarModule {}
