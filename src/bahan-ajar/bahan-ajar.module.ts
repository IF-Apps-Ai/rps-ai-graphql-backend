import { Module } from '@nestjs/common';
import { BahanAjarService } from './bahan-ajar.service';
import { BahanAjarResolver } from './bahan-ajar.resolver';
import { SettingsModule } from 'src/settings/settings.module';
import { SettingsService } from 'src/settings/settings.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [SettingsModule, LoggerModule],
  providers: [BahanAjarService, BahanAjarResolver, SettingsService],
})
export class BahanAjarModule {}
