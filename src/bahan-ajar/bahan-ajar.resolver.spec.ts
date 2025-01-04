import { Test, TestingModule } from '@nestjs/testing';
import { BahanAjarResolver } from './bahan-ajar.resolver';

describe('BahanAjarResolver', () => {
  let resolver: BahanAjarResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BahanAjarResolver],
    }).compile();

    resolver = module.get<BahanAjarResolver>(BahanAjarResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
