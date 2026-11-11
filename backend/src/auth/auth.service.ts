import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly config: ConfigService) {}

  hackclubAuth() {
    const redirect_uri = `${this.config.get('APP_URL')}/api/auth/hca/callback`;
    const client_id = this.config.get('HACKCLUB_AUTH_CLIENTID');

    return {
      url: `https://auth.hackclub.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=email+name+profile+verification_status+slack_id`,
    };
  }

  async hackclubAuthCallback(code: string, res: Response) {
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
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      path: '/',
    });

    // const hackclubUserData = await axios.get<{
    //   identity: {
    //     ysws_eligible: boolean;
    //     id: string;
    //     verification_status: boolean;
    //     slack_id: string;
    //   };
    // }>('https://auth.hackclub.com/api/v1/me', {
    //   headers: { Authorization: `Bearer ${oauthRes.data.access_token}` },
    // });

    // if (
    //   !hackclubUserData.data.identity.verification_status ||
    //   !hackclubUserData.data.identity.ysws_eligible
    // )
    //   throw new ForbiddenException(
    //     "You are not eligible for Hackachat, it's either you haven't done your id verification, or your already pass 18",
    //   );

    // const slackUserData = await axios.get<{
    //   displayName: string;
    //   imageUrl: string;
    //   userId: string;
    // }>(
    //   `https://cachet.dunkirk.sh/users/${hackclubUserData.data.identity.slack_id}`,
    // );

    // if (slackUserData.status !== 200)
    //   throw new InternalServerErrorException('Unable to retrieve  user data');

    return {
      url: '/submit',
    };
  }

  hackatime() {
    const client_id = this.config.get('HACKATIME_UID');
    const redirect_uri = `${this.config.get('APP_URL')}/api/auth/hackatime/callback`;

    return {
      url: `https://hackatime.hackclub.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=profile+read&response_type=code`,
    };
  }

  async hackatimeCallback(code: string, res: Response) {
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
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      path: '/',
    });

    // const hackclubUserData = await axios.get<{
    //   identity: {
    //     ysws_eligible: boolean;
    //     id: string;
    //     verification_status: boolean;
    //     slack_id: string;
    //   };
    // }>('https://auth.hackclub.com/api/v1/me', {
    //   headers: { Authorization: `Bearer ${oauthRes.data.access_token}` },
    // });

    // if (
    //   !hackclubUserData.data.identity.verification_status ||
    //   !hackclubUserData.data.identity.ysws_eligible
    // )
    //   throw new ForbiddenException(
    //     "You are not eligible for Hackachat, it's either you haven't done your id verification, or your already pass 18",
    //   );

    // const slackUserData = await axios.get<{
    //   displayName: string;
    //   imageUrl: string;
    //   userId: string;
    // }>(
    //   `https://cachet.dunkirk.sh/users/${hackclubUserData.data.identity.slack_id}`,
    // );

    // if (slackUserData.status !== 200)
    //   throw new InternalServerErrorException('Unable to retrieve  user data');

    return {
      url: '/submit',
    };
  }
}
