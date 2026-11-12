import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { Request } from 'express';

@Injectable()
export class HackatimeService {
  async getProjects(request: Request) {
    const access_token = request.cookies['hackatime_access_token'];

    if (!access_token) return new UnauthorizedException('user not signed in');

    const projectsRes = await axios.get<{ projects: [] }>(
      'https://hackatime.hackclub.com/api/v1/authenticated/projects?start_date=2026-11-01',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    return projectsRes.data.projects;
  }
}
