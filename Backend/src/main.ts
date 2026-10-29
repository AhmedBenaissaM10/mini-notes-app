import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import { Env } from './config/env.js';
import { buildOpenApiDocument, setupSwagger } from './swagger.setup.js';
import { writeFileSync } from 'node:fs';
import { stringify } from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));
  configureApp(app);
  app.enableShutdownHooks();
  setupSwagger(app);
  const document = buildOpenApiDocument(app);

  writeFileSync('openapi.yml', stringify(document), 'utf8');
  app.use(cookieParser());
  const config = app.get<ConfigService<Env, true>>(ConfigService);
  await app.listen(config.get('PORT', { infer: true }));
}
await bootstrap();
