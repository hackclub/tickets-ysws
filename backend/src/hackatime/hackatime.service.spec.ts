import { Test, TestingModule } from '@nestjs/testing';
import { HackatimeService } from './hackatime.service.js';

describe('HackatimeService', () => {
  let service: HackatimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HackatimeService],
    }).compile();

    service = module.get<HackatimeService>(HackatimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
