import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Env, validateEnv } from './config/env.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { NotesModule } from './notes/notes.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      validate: validateEnv,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => {
        const env = config.get('NODE_ENV', { infer: true });
        const isProd = env === 'production';
        return {
          pinoHttp: {
            level: env === 'test' ? 'silent' : isProd ? 'info' : 'debug',
            transport: isProd
              ? undefined
              : { target: 'pino-pretty', options: { singleLine: true } },
            redact: [
              'req.headers.authorization',
              'req.headers.cookie',
              'res.headers["set-cookie"]',
            ],
            autoLogging: {
              ignore: (req) => req.url?.startsWith('/health') ?? false,
            },
          },
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        throttlers: [{ ttl: 60_000, limit: 100 }],
        skipIf: () => config.get('THROTTLE_DISABLED', { infer: true }),
      }),
    }),
    PrismaModule,
    HealthModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
