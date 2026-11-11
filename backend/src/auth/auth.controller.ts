import { Controller, Get, Param, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Redirect()
  @Get()
  hackclubAuth() {
    return this.authService.hackclubAuth();
  }

  @Get('/callback')
  hackclubCallback() {
    return this.authService.hackclubAuthCallback('');
  }
}
