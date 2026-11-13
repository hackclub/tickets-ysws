import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Airtable, { base } from 'airtable';
import 'multer';

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
  async createProjectRecord(fields: Record<string, unknown>) {
    return this.base(this.config.get('AIRTABLE_BASE_ID')!)
      .table(this.config.get('AIRTABLE_TABLE')!)
      .create(fields as never);
  }

  async uploadAttachment(
    recordId: string,
    fieldIdOrName: string,
    file: Express.Multer.File,
  ) {
    const res = await fetch(
      `https://content.airtable.com/v0/${this.config.get('AIRTABLE_BASE_ID')}/${recordId}/${encodeURIComponent(
        fieldIdOrName,
      )}/uploadAttachment`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.get('AIRTABLE_ACCESS_TOKEN')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType: file.mimetype,
          filename: file.originalname,
          file: file.buffer.toString('base64'),
        }),
      },
    );

    if (!res.ok) {
      throw new InternalServerErrorException(
        `Airtable upload failed: ${res.status} ${await res.text()}`,
      );
    }
    return res.json();
  }
}
