import { Test, TestingModule } from '@nestjs/testing';
import { DosenResolver } from './dosen.resolver';

describe('DosenResolver', () => {
  let resolver: DosenResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DosenResolver],
    }).compile();

    resolver = module.get<DosenResolver>(DosenResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
