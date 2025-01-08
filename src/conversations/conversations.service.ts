import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './interfaces/conversation.interface';
import { CreateConversationInput } from './dto/create-conversation.input';
import { AddMessageInput, Role } from './dto/add-message.input';
import { PaginationInput } from './dto/pagination.input';
// import { OpenAIService } from '../openai/openai.service';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel('Conversation')
    private readonly conversationModel: Model<Conversation>,
    // private readonly openAIService: OpenAIService,
  ) {}

  // Membuat percakapan baru
  async createConversation(
    createConversationInput: CreateConversationInput,
  ): Promise<Conversation> {
    const createdConversation = new this.conversationModel(
      createConversationInput,
    );
    return createdConversation.save();
  }

  // Mendapatkan semua percakapan dengan pagination
  async getAllConversations(
    paginationInput: PaginationInput,
  ): Promise<Conversation[]> {
    const { offset, limit } = paginationInput;
    return this.conversationModel.find().skip(offset).limit(limit).exec();
  }

  // Mendapatkan percakapan berdasarkan ID
  async getConversationById(id: string): Promise<Conversation> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    const conversation = await this.conversationModel.findById(id).exec();
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return conversation;
  }

  // Menambahkan pesan ke percakapan
  async addMessage(
    conversationId: string,
    addMessageInput: AddMessageInput,
  ): Promise<Conversation> {
    const conversation = await this.getConversationById(conversationId);
    conversation.messages.push(addMessageInput as any); // Type casting untuk kesesuaian dengan Mongoose

    // Jika pesan dari user, kirim ke OpenAI dan tambahkan respons assistant
    if (addMessageInput.role === Role.USER) {
      // Ambil semua pesan untuk konteks
      const messagesForOpenAI = conversation.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Dapatkan respons dari OpenAI
      const assistantResponse =
        await this.openAIService.getAssistantResponse(messagesForOpenAI);

      const assistantMessage: AddMessageInput = {
        role: Role.ASSISTANT,
        content: assistantResponse,
      };

      conversation.messages.push(assistantMessage as any);
    }

    return conversation.save();
  }

  // Mengupdate judul percakapan
  async updateConversationTitle(
    id: string,
    title: string,
  ): Promise<Conversation> {
    const conversation = await this.getConversationById(id);
    conversation.title = title;
    return conversation.save();
  }

  // Menghapus percakapan
  async deleteConversation(id: string): Promise<boolean> {
    const result = await this.conversationModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
