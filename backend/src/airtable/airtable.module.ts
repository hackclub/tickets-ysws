import { Module } from '@nestjs/common';
import { AirtableService } from './airtable.service.js';
import { AirtableController } from './airtable.controller.js';

@Module({
  controllers: [AirtableController],
  providers: [AirtableService],
  exports: [AirtableService],
})
export class AirtableModule {}
