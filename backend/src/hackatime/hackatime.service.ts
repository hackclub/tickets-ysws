import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';

interface TrustFactor {
  trust_level: string;
  trust_value: number;
}

interface HackatimeUser {
  id: number;
  emails: string[];
  slack_id: string;
  github_username: string;
  trust_factor: TrustFactor;
}
@Injectable()
export class HackatimeService {
  async getProjects(request: Request) {
    const access_token = request.cookies['hackatime_access_token'];

    if (!access_token) throw new UnauthorizedException('user not signed in');

    const projectsRes = await axios.get<{ projects: [] }>(
      'https://hackatime.hackclub.com/api/v1/authenticated/projects?start_date=2026-11-01',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    return projectsRes.data.projects;
  }

  async getUserProfile(request: Request) {
    const access_token = request.cookies['hackatime_access_token'];

    if (!access_token) throw new UnauthorizedException('user not signed in');

    const userRes = await axios.get<HackatimeUser>(
      'https://hackatime.hackclub.com/api/v1/authenticated/me',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    return userRes.data;
  }
}
