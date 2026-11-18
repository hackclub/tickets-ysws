import { Controller } from '@nestjs/common';
import { AirtableService } from './airtable.service.js';

@Controller('airtable')
export class AirtableController {
  constructor(private readonly airtableService: AirtableService) {}
}
