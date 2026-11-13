import {
  Controller,
  Get,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Redirect()
  @Get('hca')
  hackclubAuth(@Res({ passthrough: true }) res: Response) {
    return this.authService.hackclubAuth(res);
  }

  @Redirect()
  @Get('/hca/callback')
  hackclubCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.hackclubAuthCallback(code, state, req, res);
  }

  @Redirect()
  @Get('hackatime')
  hackatime(@Res({ passthrough: true }) res: Response) {
    return this.authService.hackatime(res);
  }

  @Redirect()
  @Get('/hackatime/callback')
  hackatimeCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.hackatimeCallback(code, state, req, res);
  }

  @Redirect()
  @Get('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res);
  }
}
