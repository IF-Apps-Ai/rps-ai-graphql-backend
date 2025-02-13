import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './interfaces/conversation.interface';
import { ConversationInput } from './dto/conversation.input';
import { MessageInput } from './dto/message.input';
import { PaginationInput } from './dto/pagination.input';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel('Conversation')
    private readonly conversationModel: Model<Conversation>,
  ) {}

  // Membuat percakapan baru
  async createConversation(
    conversationInput: ConversationInput,
  ): Promise<Conversation> {
    const createdConversation = new this.conversationModel(conversationInput);
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
    messageInput: MessageInput,
  ): Promise<Conversation> {
    const conversation = await this.getConversationById(conversationId);
    conversation.messages.push(messageInput as any); // Type casting untuk kesesuaian dengan Mongoose

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
