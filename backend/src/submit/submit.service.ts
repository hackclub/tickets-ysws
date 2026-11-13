import { Injectable } from '@nestjs/common';
import { SubmitProjectDto } from './dto/submit.dto.js';
import { AirtableService } from '../airtable/airtable.service.js';
import { Request } from 'express';
import { HackatimeService } from '../hackatime/hackatime.service.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class SubmitService {
  constructor(
    private readonly airtable: AirtableService,
    private readonly hackatimeService: HackatimeService,
    private readonly userService: UserService,
  ) {}
  async submitProject(submitProjectDto: SubmitProjectDto, request: Request) {
    const {
      first_name,
      last_name,
      id: hca_id,
      slack_id,
      primary_email,
    } = await this.userService.me(request);
    const { id: hackatime_id } =
      await this.hackatimeService.getUserProfile(request);
    const {
      codeUrl,
      description,
      movieName,
      plannedMovieToWatch,
      playableUrl,
      projectName,
    } = submitProjectDto;

    this.airtable.createProjectRecord({
      'Code URL': codeUrl,
      'Playable URL': playableUrl,
      'First Name': first_name,
      'Last Name': last_name,
      Email: primary_email,
    });
  }
}
