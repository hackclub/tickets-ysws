import { Controller, Get, Param, Query, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Redirect()
  @Get('hca')
  hackclubAuth() {
    return this.authService.hackclubAuth();
  }

  @Redirect()
  @Get('/hca/callback')
  hackclubCallback(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.hackclubAuthCallback(code, res);
  }

  @Redirect()
  @Get('hackatime')
  hackatime() {
    return this.authService.hackatime();
  }

  @Redirect()
  @Get('/hackatime/callback')
  hackatimeCallback(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.hackatimeCallback(code, res);
  }
}
