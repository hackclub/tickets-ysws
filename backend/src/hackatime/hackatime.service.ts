import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import axios, { isAxiosError } from 'axios';
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

interface HackatimeProject {
  name: string;
  total_seconds: number;
  languages: string[];
  repo_url: string | null;
  total_heartbeats: number;
  first_heartbeat: string;
  last_heartbeat: string;
  most_recent_heartbeat: string;
  archived: boolean;
}

const HACKATIME_BASE = 'https://hackatime.hackclub.com/api/v1';

@Injectable()
export class HackatimeService {
  private readonly logger = new Logger(HackatimeService.name);

  private getToken(request: Request): string {
    const token = request.cookies?.['hackatime_access_token'];
    if (!token) throw new UnauthorizedException('user not signed in');
    return token;
  }

  private handleError(err: unknown, context: string): never {
    if (isAxiosError(err)) {
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        throw new UnauthorizedException(
          'hackatime session expired, sign in again',
        );
      }
      if (status === 404) {
        throw new NotFoundException('not found on hackatime');
      }

      this.logger.error(`${context} failed: ${err.code ?? ''} ${status ?? ''}`);
    } else {
      this.logger.error(`${context} failed`, err as Error);
    }

    throw new BadGatewayException('could not reach hackatime right now, please try again');
  }

  async getProjects(request: Request): Promise<HackatimeProject[]> {
    const token = this.getToken(request);

    try {
      const res = await axios.get<{ projects: HackatimeProject[] }>(
        `${HACKATIME_BASE}/authenticated/projects`,
        {
          params: { start_date: '2026-11-01' },
          headers: { Authorization: `Bearer ${token}` },
          timeout: 20000,
        },
      );
      return res.data.projects ?? [];
    } catch (err) {
      this.handleError(err, 'Fetching hackatime projects');
    }
  }

  async getUserProfile(request: Request): Promise<HackatimeUser> {
    const token = this.getToken(request);

    try {
      const res = await axios.get<HackatimeUser>(
        `${HACKATIME_BASE}/authenticated/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 20000,
        },
      );
      return res.data;
    } catch (err) {
      this.handleError(err, 'Fetching hackatime profile');
    }
  }

  async getProjectFullDetails(
    projectName: string,
    slackId: string,
  ): Promise<HackatimeProject> {
    try {
      const res = await axios.get<HackatimeProject>(
        `${HACKATIME_BASE}/users/${encodeURIComponent(slackId)}/project/${encodeURIComponent(projectName)}`,
        { timeout: 20000 },
      );
      return res.data;
    } catch (err) {
      this.handleError(err, `Fetching hackatime project "${projectName}"`);
    }
  }
}
