import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SubmitProjectDto } from './dto/submit.dto.js';
import { AirtableService } from '../airtable/airtable.service.js';
import { Request } from 'express';
import { HackatimeService } from '../hackatime/hackatime.service.js';
import { UserService } from '../user/user.service.js';
import { detectImageType } from './image-type.js';

@Injectable()
export class SubmitService {
  private readonly logger = new Logger(SubmitService.name);

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
    const imageType = detectImageType(screenshotFile.buffer);
    if (!imageType)
      throw new BadRequestException(
        'screenshot must be a JPG, PNG or WEBP image',
      );

    const {
      first_name,
      last_name,
      id: hca_id,
      slack_id,
      primary_email,
      addresses,
      birthday,
    } = await this.userService.me(request);
    if (!slack_id)
      throw new BadRequestException(
        'no Slack account is linked to your Hack Club account',
      );

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
      hackatimeProjectNames.map(
        async (projectName) =>
          await this.hackatimeService.getProjectFullDetails(
            projectName,
            slack_id,
          ),
      ),
    );

    const address = addresses?.find((a) => a.primary) ?? addresses?.[0];

    const recordPayload = {
      'Code URL': codeUrl,
      'Playable URL': playableUrl,
      'First Name': first_name,
      'Last Name': last_name,
      Email: primary_email,
      Description: description,
      'GitHub Username': github_username,

      'Address (Line 1)': address?.line_1 || 'data not provided',
      'Address (Line 2)': address?.line_2 || '',
      City: address?.city || 'data not provided',
      'State / Province': address?.state || 'data not provided',
      Country: address?.country || 'data not provided',
      'ZIP / Postal Code': address?.postal_code || 'data not provided',
      Birthday: birthday || '2026-01-01',

      'Justification - Submitter Hackatime ID': String(hackatime_id),
      'Justification - Hackatime Project Name(s) + Date Range(s)':
        hackatimeProjects
          .map(
            (project) =>
              `${project.name} ${project.first_heartbeat}-${project.last_heartbeat}`,
          )
          .toString(),

      'Movie Planned to Watch': plannedMovieToWatch,
      'Slack Id': slack_id,
      'Project Movie': movieName,
      'Project Name': projectName,
      'Optional - Override Hours Spent': parseFloat(
        (
          hackatimeProjects.reduce((sum, p) => sum + p.total_seconds, 0) / 3600
        ).toFixed(1),
      ),
    };

    const created = await this.airtable.createProjectRecord(recordPayload);
    const record = Array.isArray(created) ? created[0] : created;

    if (!record) {
      throw new InternalServerErrorException('Failed to create project record');
    }

    try {
      await this.airtable.uploadAttachment(record.id, 'Screenshot', {
        buffer: screenshotFile.buffer,
        ...imageType,
      });
    } catch (err) {
      await this.airtable
        .deleteProjectRecord(record.id)
        .catch((deleteErr) =>
          this.logger.error(
            `Failed to delete record ${record.id} after upload failure`,
            deleteErr,
          ),
        );
      throw err;
    }

    return {
      message: 'Project submitted successfully',
    };
  }
}
