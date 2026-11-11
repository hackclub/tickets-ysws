import { Module } from '@nestjs/common';
import { HackatimeService } from './hackatime.service.js';
import { HackatimeController } from './hackatime.controller.js';

@Module({
  controllers: [HackatimeController],
  providers: [HackatimeService],
})
export class HackatimeModule {}
