import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SubmitService } from './submit.service.js';
import { type Request } from 'express';
import { SubmitProjectDto } from './dto/submit.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('submit')
export class SubmitController {
  constructor(private readonly submitService: SubmitService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('screenshotFile', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  submitProject(
    @Body() submitProjectDto: SubmitProjectDto,
    @Req() request: Request,
    @UploadedFile() screenshotFile: Express.Multer.File,
  ) {
    if (!screenshotFile)
      throw new BadRequestException('screenshot is required');
    return this.submitService.submitProject(
      submitProjectDto,
      request,
      screenshotFile,
    );
  }
}
