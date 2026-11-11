import { Controller } from '@nestjs/common';
import { SubmitService } from './submit.service.js';

@Controller('submit')
export class SubmitController {
  constructor(private readonly submitService: SubmitService) {}
}
