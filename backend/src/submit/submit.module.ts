import { Module } from '@nestjs/common';
import { SubmitService } from './submit.service.js';
import { SubmitController } from './submit.controller.js';

@Module({
  controllers: [SubmitController],
  providers: [SubmitService],
})
export class SubmitModule {}
