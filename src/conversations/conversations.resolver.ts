import { Resolver } from '@nestjs/graphql';
import { ConversationsService } from './conversations.service';
import { Conversation } from './models/conversation.model';

@Resolver(() => Conversation)
export class ConversationsResolver {
  constructor(private readonly conversationsService: ConversationsService) {}

  // // Query untuk mendapatkan semua percakapan
  // @Query(() => [Conversation])
  // async getAllConversations(
  //   @Args('pagination', { type: () => PaginationInput, nullable: true })
  //   pagination: PaginationInput,
  // ): Promise<Conversation[]> {
  //   return this.conversationsService.getAllConversations(
  //     pagination || { offset: 0, limit: 10 },
  //   );
  // }

  // // Query untuk mendapatkan percakapan berdasarkan ID
  // @Query(() => Conversation)
  // async getConversationById(
  //   @Args('id', { type: () => ID }) id: string,
  // ): Promise<Conversation> {
  //   return this.conversationsService.getConversationById(id);
  // }

  // // Mutation untuk membuat percakapan baru
  // @Mutation(() => Conversation)
  // async createConversation(
  //   @Args('input') createConversationInput: CreateConversationInput,
  // ): Promise<Conversation> {
  //   return this.conversationsService.createConversation(
  //     createConversationInput,
  //   );
  // }

  // // Mutation untuk menambahkan pesan ke percakapan
  // @Mutation(() => Conversation)
  // async addMessage(
  //   @Args('conversationId', { type: () => ID }) conversationId: string,
  //   @Args('input') addMessageInput: AddMessageInput,
  // ): Promise<Conversation> {
  //   return this.conversationsService.addMessage(
  //     conversationId,
  //     addMessageInput,
  //   );
  // }

  // // Mutation untuk mengupdate judul percakapan
  // @Mutation(() => Conversation)
  // async updateConversationTitle(
  //   @Args('id', { type: () => ID }) id: string,
  //   @Args('title') title: string,
  // ): Promise<Conversation> {
  //   return this.conversationsService.updateConversationTitle(id, title);
  // }

  // // Mutation untuk menghapus percakapan
  // @Mutation(() => Boolean)
  // async deleteConversation(
  //   @Args('id', { type: () => ID }) id: string,
  // ): Promise<boolean> {
  //   return this.conversationsService.deleteConversation(id);
  // }
}
