import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

function inlineScriptHashes(htmlPath: string): string[] {
  const html = readFileSync(htmlPath, 'utf8');
  const hashes: string[] = [];
  // inline scripts only: skip tags that have a src attribute
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;

  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const body = match[1];
    if (!body.trim()) continue;
    // hash the exact text between the tags, whitespace included
    const hash = createHash('sha256').update(body).digest('base64');
    hashes.push(`'sha256-${hash}'`);
  }
  return hashes;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    instrument: ObserveInstrument,
  });

  const hashes = inlineScriptHashes(
    join(
      import.meta.dirname,
      '..',
      '..',
      'frontend',
      'build',
      'client',
      'index.html',
    ), // adjust to your build output
  );

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", ...hashes],
        },
      },
    }),
  );

  app.set('trust proxy', 1);
  app.use(cookieParser());

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
