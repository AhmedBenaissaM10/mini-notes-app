import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Env } from './config/env.js';

export function buildOpenApiDocument(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Mini Notes API')
    .setDescription('REST API for managing notes')
    .setVersion('1.0.0')
    .build();

  return SwaggerModule.createDocument(app, options);
}

export function setupSwagger(app: INestApplication) {
  const config = app.get<ConfigService<Env, true>>(ConfigService);
  if (config.get('NODE_ENV', { infer: true }) === 'production') return;

  SwaggerModule.setup('docs', app, buildOpenApiDocument(app), {
    swaggerOptions: { persistAuthorization: true },
  });
}
