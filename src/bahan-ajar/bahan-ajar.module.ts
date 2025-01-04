import { Module } from '@nestjs/common';
import { BahanAjarService } from './bahan-ajar.service';
import { BahanAjarResolver } from './bahan-ajar.resolver';

@Module({
  providers: [BahanAjarService, BahanAjarResolver]
})
export class BahanAjarModule {}
