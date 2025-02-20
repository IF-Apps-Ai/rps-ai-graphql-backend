import { Module } from '@nestjs/common';
import { CompletionService } from './completion.service';

@Module({
  providers: [CompletionService]
})
export class CompletionModule {}
