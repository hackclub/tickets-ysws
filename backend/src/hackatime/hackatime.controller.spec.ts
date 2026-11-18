import { Test, TestingModule } from '@nestjs/testing';
import { HackatimeController } from './hackatime.controller.js';
import { HackatimeService } from './hackatime.service.js';

describe('HackatimeController', () => {
  let controller: HackatimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HackatimeController],
      providers: [HackatimeService],
    }).compile();

    controller = module.get<HackatimeController>(HackatimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
