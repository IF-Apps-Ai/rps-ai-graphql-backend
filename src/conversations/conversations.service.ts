import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation as ConversationInterface } from './interfaces/conversation.interface';
import { Conversation as ConversationModel } from './models/conversation.model';
import { ConversationInput } from './dto/conversation.input';
import { MessageInput } from './dto/message.input';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel('Conversation')
    private readonly conversationModel: Model<ConversationInterface>,
  ) {}

  private transformConversation(
    conversation: ConversationInterface,
  ): ConversationModel {
    const convObj = conversation.toObject();
    return {
      id: convObj._id.toString(),
      userId: convObj.userId ? convObj.userId : undefined,
      title: convObj.title,
      model: convObj.model,
      messages: convObj.messages.map((message: any) => ({
        id: message._id
          ? message._id.toString()
          : new Types.ObjectId().toString(),
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
        metadata: message.metadata,
      })),
      createdAt: convObj.createdAt,
      updatedAt: convObj.updatedAt,
    };
  }

  async getConversations(): Promise<ConversationModel[]> {
    const conversations = await this.conversationModel.find().exec();
    return conversations.map((conversation) =>
      this.transformConversation(conversation),
    );
  }

  async getConversationById(id: string): Promise<ConversationModel> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    const conversation = await this.conversationModel.findById(id).exec();
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return this.transformConversation(conversation);
  }

  async createConversation(
    conversationInput: ConversationInput,
  ): Promise<ConversationModel> {
    const createdConversation = new this.conversationModel(conversationInput);
    const savedConversation = await createdConversation.save();
    return this.transformConversation(savedConversation);
  }

  async addMessage(
    conversationId: string,
    messageInput: MessageInput,
  ): Promise<ConversationModel> {
    const conversationDoc = await this.conversationModel
      .findById(conversationId)
      .exec();
    if (!conversationDoc) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found`,
      );
    }
    const newMessage = {
      _id: new Types.ObjectId(),
      ...messageInput,
    };
    conversationDoc.messages.push(newMessage as any);
    const updatedConversation = await conversationDoc.save();
    return this.transformConversation(updatedConversation);
  }

  async updateConversationTitle(
    id: string,
    title: string,
  ): Promise<ConversationModel> {
    const conversation = await this.conversationModel
      .findByIdAndUpdate(id, { title }, { new: true })
      .exec();
    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }
    return this.transformConversation(conversation);
  }

  async deleteConversation(id: string): Promise<boolean> {
    const result = await this.conversationModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
