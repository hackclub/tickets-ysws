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
  async submitProject(
    submitProjectDto: SubmitProjectDto,
    request: Request,
    screenshotFile: Express.Multer.File,
  ) {
    const {
      first_name,
      last_name,
      id: hca_id,
      slack_id,
      primary_email,
    } = await this.userService.me(request);
    const { id: hackatime_id, github_username } =
      await this.hackatimeService.getUserProfile(request);
    const {
      codeUrl,
      description,
      movieName,
      plannedMovieToWatch,
      playableUrl,
      projectName,
      hackatimeProjectNames,
    } = submitProjectDto;

    const hackatimeProjects = await Promise.all(
      hackatimeProjectNames.map((projectName) =>
        this.hackatimeService.getProjectFullDetails(projectName, slack_id),
      ),
    );

    const record = await this.airtable.createProjectRecord({
      'Code URL': codeUrl,
      'Playable URL': playableUrl,
      'First Name': first_name,
      'Last Name': last_name,
      Email: primary_email,
      Description: description,
      'GitHub Username': github_username,

      'Address (Line 1)': 'fill this later',
      'Address (Line 2)': 'fill this later',
      City: 'fill this later',
      'State / Province': 'fill this later',
      Country: 'fill this later',
      'ZIP / Postal Code': 'fill this later',
      Birthday: 'fill this later',

      'Justification - Submitter Hackatime ID': hackatime_id,
      'Justification - Hackatime Project Name(s) + Date Range(s)':
        hackatimeProjects
          .map(
            (project) =>
              `${project.name} ${project.first_heartbeat}-${project.last_heartbeat}`,
          )
          .toString(),

      'Movie Planned to Watch': plannedMovieToWatch,
      'Slack Id': slack_id,
    });

    await this.airtable.uploadAttachment(
      record[0].id,
      'Screenshot',
      screenshotFile,
    );

    return {
      message: 'Project submitted successfully',
    };
  }
}
