import { Test, TestingModule } from '@nestjs/testing';
import { RpsResolver } from './rps.resolver';

describe('RpsResolver', () => {
  let resolver: RpsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RpsResolver],
    }).compile();

    resolver = module.get<RpsResolver>(RpsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
