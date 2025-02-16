import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsResolver } from './conversations.resolver';
import { ConversationsService } from './conversations.service';

const mockConversationsService = {
  getConversations: jest.fn(),
  getConversationById: jest.fn(),
  createConversation: jest.fn(),
  addMessage: jest.fn(),
  updateConversationTitle: jest.fn(),
  deleteConversation: jest.fn(),
};

describe('ConversationsResolver', () => {
  let resolver: ConversationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsResolver,
        {
          provide: ConversationsService,
          useValue: mockConversationsService,
        },
      ],
    }).compile();

    resolver = module.get<ConversationsResolver>(ConversationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
