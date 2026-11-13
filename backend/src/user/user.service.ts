import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';

@Injectable()
export class UserService {
  async me(request: Request) {
    const access_token = request.cookies['hca_access_token'];

    if (!access_token) throw new UnauthorizedException('user not signed in');

    const hackclubUserData = await axios.get<{
      identity: {
        ysws_eligible: boolean;
        first_name: string;
        last_name: string;
        id: string;
        verification_status: boolean;
        slack_id: string;
        primary_email: string;
      };
    }>('https://auth.hackclub.com/api/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    console.log(hackclubUserData.data);

    const slackUserData = await axios.get<{
      displayName: string;
      imageUrl: string;
      userId: string;
    }>(
      `https://cachet.dunkirk.sh/users/${hackclubUserData.data.identity.slack_id}`,
    );

    return { ...hackclubUserData.data.identity, ...slackUserData.data };
  }
}
