import { Module } from '@nestjs/common';
import { RpsService } from './rps.service';
import { RpsResolver } from './rps.resolver';

@Module({
  providers: [RpsService, RpsResolver]
})
export class RpsModule {}
