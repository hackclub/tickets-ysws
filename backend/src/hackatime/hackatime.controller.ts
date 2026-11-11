import { Controller } from '@nestjs/common';
import { HackatimeService } from './hackatime.service.js';

@Controller('hackatime')
export class HackatimeController {
  constructor(private readonly hackatimeService: HackatimeService) {}
}
