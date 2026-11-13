import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service.js';
import { type Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  me(@Req() request: Request): Promise<any> {
    return this.userService.me(request);
  }
}
