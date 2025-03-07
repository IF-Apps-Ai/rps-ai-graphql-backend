import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSchema } from './schemas/conversation.schema';
import { ConversationsService } from './conversations.service';
import { ConversationsResolver } from './conversations.resolver';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Conversation', schema: ConversationSchema }],
      'MONGODB_CONNECTION',
    ),
  ],
  providers: [ConversationsService, ConversationsResolver],
})
export class ConversationsModule {}
