import { Test, TestingModule } from '@nestjs/testing';
import { RpsService } from './rps.service';

describe('RpsService', () => {
  let service: RpsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RpsService],
    }).compile();

    service = module.get<RpsService>(RpsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
