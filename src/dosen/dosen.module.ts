import { Module } from '@nestjs/common';
import { DosenService } from './dosen.service';
import { DosenResolver } from './dosen.resolver';

@Module({
  providers: [DosenService, DosenResolver],
  exports: [DosenService],
})
export class DosenModule {}
