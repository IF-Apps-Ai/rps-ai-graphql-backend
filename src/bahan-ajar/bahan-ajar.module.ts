import { Module } from '@nestjs/common';
import { BahanAjarService } from './bahan-ajar.service';
import { BahanAjarResolver } from './bahan-ajar.resolver';
import { SettingsModule } from 'src/settings/settings.module';
import { SettingsService } from 'src/settings/settings.service';

@Module({
  imports: [SettingsModule],
  providers: [BahanAjarService, BahanAjarResolver, SettingsService],
})
export class BahanAjarModule {}
