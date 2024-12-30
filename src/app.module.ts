import { Module } from '@nestjs/common';
import { RpsModule } from './rps/rps.module';
import { CommonModule } from './common/common.module';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [CommonModule, RpsModule],
  controllers: [AppController],
  providers: [AppResolver, AppService],
})
export class AppModule {}
