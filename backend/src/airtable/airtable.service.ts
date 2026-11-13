import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Airtable, { base } from 'airtable';

@Injectable()
export class AirtableService extends Airtable {
  constructor(private readonly config: ConfigService) {
    super({ apiKey: config.get('AIRTABLE_ACCESS_TOKEN') });
  }

  getTicketYsWsBase() {
    return this.base('');
  }
}
