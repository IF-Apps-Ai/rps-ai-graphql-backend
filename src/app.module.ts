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

@Module({
  imports: [CommonModule, UserModule, AuthModule, RpsModule, DatabaseModule, DosenModule],
  controllers: [AppController],
  providers: [AppResolver, AppService],
})
export class AppModule {}
