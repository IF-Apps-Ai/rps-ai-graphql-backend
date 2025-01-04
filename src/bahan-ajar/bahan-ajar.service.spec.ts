import { Test, TestingModule } from '@nestjs/testing';
import { BahanAjarService } from './bahan-ajar.service';

describe('BahanAjarService', () => {
  let service: BahanAjarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BahanAjarService],
    }).compile();

    service = module.get<BahanAjarService>(BahanAjarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
