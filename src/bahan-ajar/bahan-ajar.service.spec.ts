import { Test, TestingModule } from '@nestjs/testing';
import { BahanAjarService } from './bahan-ajar.service';
import { SettingsService } from 'src/settings/settings.service';

describe('BahanAjarService', () => {
  let service: BahanAjarService;

  const settingsServiceMock = {
    findOne: jest.fn((key: string) => {
      const settings = {
        bahan_ajar_prompt_system: { values: 'dummy system prompt' },
        bahan_ajar_ai_model: { values: 'dummy-ai-model' },
        bahan_ajar_temperature: { values: '0.7' },
      };
      return Promise.resolve(settings[key]);
    }),
  };

  const bahanAjarLogRepositoryMock = {
    save: jest.fn().mockResolvedValue(true),
    findOne: jest.fn().mockResolvedValue(null),
  };

  const dataSourceMock = {
    getRepository: jest.fn().mockReturnValue(bahanAjarLogRepositoryMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BahanAjarService,
        { provide: SettingsService, useValue: settingsServiceMock },
        { provide: 'DATA_SOURCE', useValue: dataSourceMock },
      ],
    }).compile();

    service = module.get<BahanAjarService>(BahanAjarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
