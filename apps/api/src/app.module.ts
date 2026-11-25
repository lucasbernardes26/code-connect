import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AuthenticationModule, type Duration } from '@nestjs/authentication';
import { DrizzleModule } from '@nestjs/drizzle';
import { createObserveModule } from '@nestjs/observe';
import { drizzle } from 'drizzle-orm/node-postgres';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import * as schema from './database/schema.js';
import { UsersModule } from './users/users.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

const DEV_FALLBACK_JWT_SECRET = 'dev-only-jwt-secret-change-in-production-32bytes';
const DEV_FALLBACK_DATABASE_URL = 'postgresql://codeconnect:codeconnect@localhost:5432/codeconnect';

function resolveDatabaseUrl(configService: ConfigService): string {
  const url = configService.get<string>('DATABASE_URL')?.trim();
  if (url) {
    return url;
  }
  if (configService.get<string>('NODE_ENV') === 'production') {
    throw new Error('DATABASE_URL must be set in production');
  }
  return DEV_FALLBACK_DATABASE_URL;
}

function resolveJwtTtl(): Duration {
  const ttl = process.env.JWT_TTL?.trim();
  if (ttl && /^\d+(ms|s|m|h|d)$/.test(ttl)) {
    return ttl as Duration;
  }
  return '15m';
}

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret && secret.length >= 32) {
    return secret;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set to at least 32 characters in production');
  }
  return DEV_FALLBACK_JWT_SECRET;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        drizzle,
        connection: resolveDatabaseUrl(configService),
        schema,
      }),
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'api',
    }),
    AuthenticationModule.forRoot({
      accessToken: {
        key: resolveJwtSecret(),
        issuer: 'code-connect-api',
        audience: 'code-connect-web',
        ttl: resolveJwtTtl(),
      },
      refreshToken: false,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
