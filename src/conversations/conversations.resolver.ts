import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ConversationsService } from './conversations.service';
import { Conversation } from './models/conversation.model';
import { ConversationInput } from './dto/conversation.input';
import { MessageInput } from './dto/message.input';

@Resolver(() => Conversation)
export class ConversationsResolver {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Query(() => [Conversation])
  async getConversations(): Promise<Conversation[]> {
    return this.conversationsService.getConversations();
  }

  @Query(() => Conversation)
  async getConversationById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Conversation> {
    return this.conversationsService.getConversationById(id);
  }

  @Mutation(() => Conversation)
  async createConversation(
    @Args('input') conversationInput: ConversationInput,
  ): Promise<Conversation> {
    return this.conversationsService.createConversation(conversationInput);
  }

  @Mutation(() => Conversation)
  async addMessage(
    @Args('conversationId', { type: () => ID }) conversationId: string,
    @Args('input') messageInput: MessageInput,
  ): Promise<Conversation> {
    return this.conversationsService.addMessage(conversationId, messageInput);
  }

  @Mutation(() => Conversation)
  async updateConversationTitle(
    @Args('id', { type: () => ID }) id: string,
    @Args('title') title: string,
  ): Promise<Conversation> {
    return this.conversationsService.updateConversationTitle(id, title);
  }

  @Mutation(() => Boolean)
  async deleteConversation(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.conversationsService.deleteConversation(id);
  }
}
