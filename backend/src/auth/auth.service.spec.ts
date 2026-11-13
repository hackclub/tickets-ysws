import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosHeaders } from 'axios';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;
  const configValues: Record<string, string> = {
    APP_URL: 'https://tickets.example',
    HACKCLUB_AUTH_CLIENTID: 'hca-client',
    HACKCLUB_AUTH_SECRET: 'hca-secret',
    HACKATIME_UID: 'hackatime-client',
    HACKATIME_SECRET: 'hackatime-secret',
    NODE_ENV: 'test',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => configValues[key],
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.each([
    {
      name: 'Hack Club Auth',
      start: (res: Response) => service.hackclubAuth(res),
      callback: (
        code: string,
        state: string,
        req: Request,
        res: Response,
      ) => service.hackclubAuthCallback(code, state, req, res),
      cookieName: 'hca_oauth_state',
    },
    {
      name: 'Hackatime',
      start: (res: Response) => service.hackatime(res),
      callback: (
        code: string,
        state: string,
        req: Request,
        res: Response,
      ) => service.hackatimeCallback(code, state, req, res),
      cookieName: 'hackatime_oauth_state',
    },
  ])('$name validates a one-time OAuth state', async ({
    start,
    callback,
    cookieName,
  }) => {
    const cookie = vi.fn();
    const clearCookie = vi.fn();
    const res = { cookie, clearCookie } as unknown as Response;
    const authorization = start(res);
    const state = new URL(authorization.url).searchParams.get('state');

    expect(state).toMatch(/^[a-f0-9]{64}$/);
    expect(cookie).toHaveBeenCalledWith(
      cookieName,
      state,
      expect.objectContaining({ httpOnly: true, maxAge: 5 * 60 * 1000 }),
    );

    const post = vi.spyOn(axios, 'post').mockResolvedValue({
      status: 200,
      statusText: 'OK',
      data: { access_token: 'access-token' },
      headers: {},
      config: { headers: new AxiosHeaders() },
    });
    const req = { cookies: { [cookieName]: state } } as Request;

    await callback('oauth-code', state!, req, res);

    expect(clearCookie).toHaveBeenCalledWith(
      cookieName,
      expect.objectContaining({ path: '/' }),
    );
    expect(post).toHaveBeenCalledOnce();
  });

  it.each([
    {
      name: 'Hack Club Auth',
      callback: (state: string, req: Request, res: Response) =>
        service.hackclubAuthCallback('oauth-code', state, req, res),
      cookieName: 'hca_oauth_state',
    },
    {
      name: 'Hackatime',
      callback: (state: string, req: Request, res: Response) =>
        service.hackatimeCallback('oauth-code', state, req, res),
      cookieName: 'hackatime_oauth_state',
    },
  ])('$name rejects a mismatched OAuth state before token exchange', async ({
    callback,
    cookieName,
  }) => {
    const clearCookie = vi.fn();
    const res = { clearCookie } as unknown as Response;
    const req = { cookies: { [cookieName]: 'cookie-state' } } as Request;
    const post = vi.spyOn(axios, 'post');

    await expect(callback('query-state', req, res)).rejects.toThrow(
      'Invalid OAuth state',
    );

    expect(clearCookie).toHaveBeenCalledWith(
      cookieName,
      expect.objectContaining({ path: '/' }),
    );
    expect(post).not.toHaveBeenCalled();
  });
});
