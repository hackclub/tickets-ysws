import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Airtable, { base } from 'airtable';
import 'multer';

@Injectable()
export class AirtableService extends Airtable {
  private readonly logger = new Logger(AirtableService.name);

  constructor(private readonly config: ConfigService) {
    super({ apiKey: config.get('AIRTABLE_ACCESS_TOKEN') });
  }

  getTicketYsWsBaseTable() {
    return this.base(this.config.get('AIRTABLE_BASE_ID')!).table(
      this.config.get('AIRTABLE_TABLE')!,
    );
  }
  async createProjectRecord(fields: Record<string, unknown>) {
    try {
      const data = await this.base(this.config.get('AIRTABLE_BASE_ID')!)
        .table(this.config.get('AIRTABLE_TABLE')!)
        .create(fields as never);
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to submit project');
    }
  }

  async deleteProjectRecord(recordId: string) {
    await this.getTicketYsWsBaseTable().destroy(recordId);
  }

  async uploadAttachment(
    recordId: string,
    fieldIdOrName: string,
    file: { buffer: Buffer; contentType: string; extension: string },
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
          contentType: file.contentType,
          filename: `tickets-projects-screenshot-${Date.now()}.${file.extension}`,
          file: file.buffer.toString('base64'),
        }),
      },
    );

    if (!res.ok) {
      this.logger.error(
        `Airtable upload failed: ${res.status} ${await res.text()}`,
      );
      throw new InternalServerErrorException('Failed to upload screenshot');
    }
    return res.json();
  }
}
