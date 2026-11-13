import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Airtable, { base } from 'airtable';

@Injectable()
export class AirtableService extends Airtable {
  constructor(private readonly config: ConfigService) {
    super({ apiKey: config.get('AIRTABLE_ACCESS_TOKEN') });
  }

  getTicketYsWsBaseTable() {
    return this.base(this.config.get('AIRTABLE_BASE_ID')!).table(
      this.config.get('AIRTABLE_TABLE')!,
    );
  }
}
