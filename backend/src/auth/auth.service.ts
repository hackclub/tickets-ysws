import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';

const OAUTH_STATE_MAX_AGE = 5 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  private cookieOptions() {
    return {
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };
  }

  private createOAuthState(res: Response, cookieName: string): string {
    const state = randomBytes(32).toString('hex');
    res.cookie(cookieName, state, {
      ...this.cookieOptions(),
      maxAge: OAUTH_STATE_MAX_AGE,
    });
    return state;
  }

  private validateOAuthState(
    req: Request,
    res: Response,
    cookieName: string,
    state: string | undefined,
  ): void {
    const cookieState = req.cookies?.[cookieName];
    res.clearCookie(cookieName, this.cookieOptions());

    if (
      typeof cookieState !== 'string' ||
      typeof state !== 'string' ||
      !cookieState ||
      !state
    ) {
      throw new ForbiddenException('Invalid OAuth state');
    }

    const expected = Buffer.from(cookieState);
    const received = Buffer.from(state);
    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      throw new ForbiddenException('Invalid OAuth state');
    }
  }

  hackclubAuth(res: Response) {
    const redirect_uri = `${this.config.get('APP_URL')}/api/auth/hca/callback`;
    const client_id = this.config.get('HACKCLUB_AUTH_CLIENTID');
    const state = this.createOAuthState(res, 'hca_oauth_state');
    const params = new URLSearchParams({
      client_id: client_id ?? '',
      redirect_uri,
      response_type: 'code',
      scope: `email name profile verification_status slack_id${this.config.get('NODE_ENV') === 'production' ? ' basic_info addresses' : ''}`,
      state,
    });

    return {
      url: `https://auth.hackclub.com/oauth/authorize?${params}`,
    };
  }

  async hackclubAuthCallback(
    code: string,
    state: string | undefined,
    req: Request,
    res: Response,
  ) {
    this.validateOAuthState(req, res, 'hca_oauth_state', state);
    if (!code) throw new BadRequestException('code is required');

    const redirect_uri = `${this.config.get('APP_URL')}/api/auth/hca/callback`;
    const client_id = this.config.get<string>('HACKCLUB_AUTH_CLIENTID');
    const client_secret = this.config.get<string>('HACKCLUB_AUTH_SECRET');

    const reqBody = {
      client_id,
      client_secret,
      redirect_uri,
      code,
      grant_type: 'authorization_code',
    };

    const oauthRes = await axios.post<{
      access_token: string;
    }>('https://auth.hackclub.com/oauth/token', {
      ...reqBody,
      headers: { 'Content-Type': 'application/json' },
    });

    if (oauthRes.status !== 200)
      throw new InternalServerErrorException(
        `Failed to exchange code for token: ${oauthRes.status} ${oauthRes.statusText}`,
      );

    res.cookie('hca_access_token', oauthRes.data.access_token, {
      ...this.cookieOptions(),
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return {
      url: '/submit',
    };
  }

  hackatime(res: Response) {
    const client_id = this.config.get('HACKATIME_UID');
    const redirect_uri = `${this.config.get('APP_URL')}/api/auth/hackatime/callback`;
    const state = this.createOAuthState(res, 'hackatime_oauth_state');
    const params = new URLSearchParams({
      client_id: client_id ?? '',
      redirect_uri,
      scope: 'profile read',
      response_type: 'code',
      state,
    });

    return {
      url: `https://hackatime.hackclub.com/oauth/authorize?${params}`,
    };
  }

  async hackatimeCallback(
    code: string,
    state: string | undefined,
    req: Request,
    res: Response,
  ) {
    this.validateOAuthState(req, res, 'hackatime_oauth_state', state);
    if (!code) throw new BadRequestException('code is required');

    const redirect_uri = `${this.config.get('APP_URL')}/api/auth/hackatime/callback`;
    const client_id = this.config.get<string>('HACKATIME_UID');
    const client_secret = this.config.get<string>('HACKATIME_SECRET');

    const reqBody = {
      client_id,
      client_secret,
      redirect_uri,
      code,
      grant_type: 'authorization_code',
    };

    const oauthRes = await axios.post<{
      access_token: string;
    }>('https://hackatime.hackclub.com/oauth/token', {
      ...reqBody,
      headers: { 'Content-Type': 'application/json' },
    });

    if (oauthRes.status !== 200)
      throw new InternalServerErrorException(
        `Failed to exchange code for token: ${oauthRes.status} ${oauthRes.statusText}`,
      );

    res.cookie('hackatime_access_token', oauthRes.data.access_token, {
      ...this.cookieOptions(),
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return {
      url: '/submit',
    };
  }

  logout(req: Request, res: Response) {
    res.clearCookie('hca_access_token', {
      ...this.cookieOptions(),
    });
    res.clearCookie('hackatime_access_token', {
      ...this.cookieOptions(),
    });

    return {
      url: '/submit',
    };
  }
}
