import {
  BadGatewayException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import axios, { isAxiosError } from 'axios';
import { Request } from 'express';

interface HackclubAddress {
  id: string;
  first_name: string;
  last_name: string;
  line_1: string;
  line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
  primary: boolean;
}

interface HackclubIdentity {
  id: string;
  ysws_eligible: boolean;
  verification_status: string;
  first_name: string;
  last_name: string;
  primary_email: string;
  slack_id: string | null;
  phone_number?: string;
  birthday?: string; // "YYYY-MM-DD"
  legal_first_name?: string;
  legal_last_name?: string;
  addresses?: HackclubAddress[];
}

interface SlackProfile {
  displayName: string;
  imageUrl: string;
  userId: string;
}

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async me(request: Request) {
    const access_token = request.cookies?.['hca_access_token'];

    if (!access_token) throw new UnauthorizedException('user not signed in');

    let identity: HackclubIdentity;
    try {
      const res = await axios.get<{ identity: HackclubIdentity }>(
        'https://auth.hackclub.com/api/v1/me',
        {
          headers: { Authorization: `Bearer ${access_token}` },
          timeout: 20000,
        },
      );
      identity = res.data.identity;
    } catch (err) {
      if (
        isAxiosError(err) &&
        (err.response?.status === 401 || err.response?.status === 403)
      ) {
        throw new UnauthorizedException('session expired, sign in again');
      }
      this.logger.error(
        'Hack Club auth request failed',
        isAxiosError(err) ? `${err.code} ${err.response?.status}` : err,
      );
      throw new BadGatewayException(
        'could not verify your account right now, please try again',
      );
    }

    let slack: Partial<SlackProfile> = {};
    if (identity.slack_id) {
      try {
        const res = await axios.get<SlackProfile>(
          `https://cachet.dunkirk.sh/users/${identity.slack_id}`,
          { timeout: 20000 },
        );
        slack = res.data;
      } catch (err) {
        this.logger.warn(
          `Slack profile lookup failed for ${identity.slack_id}`,
          isAxiosError(err) ? `${err.code} ${err.response?.status}` : err,
        );
      }
    }

    console.log({
      ...identity,
      displayName: slack.displayName ?? null,
      imageUrl: slack.imageUrl ?? null,
      userId: slack.userId ?? null,
    });
    return {
      ...identity,
      displayName: slack.displayName ?? null,
      imageUrl: slack.imageUrl ?? null,
      userId: slack.userId ?? null,
    };
  }
}
