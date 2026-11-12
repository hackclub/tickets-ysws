import { Controller, Get, Req } from '@nestjs/common';
import { HackatimeService } from './hackatime.service.js';
import { type Request } from 'express';

@Controller('hackatime')
export class HackatimeController {
  constructor(private readonly hackatimeService: HackatimeService) {}

  @Get('projects')
  getProjects(@Req() request: Request) {
    return this.hackatimeService.getProjects(request);
  }
}
