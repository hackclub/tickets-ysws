import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';

@Injectable()
export class UserService {
  async me(request: Request) {
    const access_token = request.cookies['hca_access_token'];

    if (!access_token) return new UnauthorizedException('user not signed in');

    const hackclubUserData = await axios.get<{
      identity: {
        ysws_eligible: boolean;
        id: string;
        verification_status: boolean;
        slack_id: string;
      };
    }>('https://auth.hackclub.com/api/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return hackclubUserData.data;
  }
}
