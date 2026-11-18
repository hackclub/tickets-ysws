import { Module } from '@nestjs/common';
import { SubmitService } from './submit.service.js';
import { SubmitController } from './submit.controller.js';
import { AirtableModule } from '../airtable/airtable.module.js';
import { AirtableService } from '../airtable/airtable.service.js';
import { HackatimeService } from '../hackatime/hackatime.service.js';
import { UserService } from '../user/user.service.js';

@Module({
  controllers: [SubmitController],
  providers: [SubmitService, AirtableService, HackatimeService, UserService],
  exports: [SubmitService],
})
export class SubmitModule {}
