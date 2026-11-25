import { INestApplication } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { getDrizzleToken } from '@nestjs/drizzle';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import type { Database } from '../src/database/database.types.js';
import { users } from '../src/database/schema.js';

describe('Code Connect API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PasswordHasher)
      .useValue(new PasswordHasher({ logN: 10 }))
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const db = moduleFixture.get<Database>(getDrizzleToken());
    await db.delete(users);
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  it('registers a user, logs in with JWT, and fetches the authenticated user', async () => {
    const registerRes = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Ada Lovelace',
        email: 'Ada@Example.com',
        password: 'secret123',
      })
      .expect(201);

    expect(registerRes.body).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    });
    expect(registerRes.body.id).toBeTypeOf('string');
    expect(registerRes.body.createdAt).toBeTypeOf('string');
    expect(registerRes.body.passwordHash).toBeUndefined();

    // Duplicate email must return 409 Conflict
    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Ada Duplicate',
        email: 'ada@example.com',
        password: 'secret123',
      })
      .expect(409);

    // Invalid login must return 401 Unauthorized
    await request(app.getHttpServer())
      .post('/auth/tokens')
      .send({
        email: 'ada@example.com',
        password: 'wrong-password',
      })
      .expect(401);

    // Valid login returns JWT accessToken
    const loginRes = await request(app.getHttpServer())
      .post('/auth/tokens')
      .send({
        email: 'ada@example.com',
        password: 'secret123',
      })
      .expect(200);

    expect(loginRes.body.accessToken).toBeTypeOf('string');
    expect(loginRes.body.expiresIn).toBeTypeOf('number');

    // Protected route without token returns 401
    await request(app.getHttpServer()).get('/users/me').expect(401);

    // Protected route with tampered token returns 401
    await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', 'Bearer invalid.jwt.token')
      .expect(401);

    // Protected route with valid Bearer token returns the logged-in user
    const meRes = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
      .expect(200);

    expect(meRes.body).toEqual(registerRes.body);
  });

  it('rejects invalid payloads and unknown properties with 400 Bad Request', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'A',
        email: 'not-an-email',
        password: '123',
        extraField: 'should-be-rejected',
      })
      .expect(400);

    await request(app.getHttpServer())
      .post('/auth/tokens')
      .send({
        email: 'not-an-email',
        password: '',
      })
      .expect(400);
  });

  it('generates OpenAPI document with all 3 endpoints and input/output schemas', () => {
    const config = new DocumentBuilder()
      .setTitle('Code Connect API')
      .setVersion('1.0')
      .addBearerAuth()
      .addSecurityRequirements('bearer')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    expect(document.paths['/users']?.post).toBeDefined();
    expect(document.paths['/auth/tokens']?.post).toBeDefined();
    expect(document.paths['/users/me']?.get).toBeDefined();
    expect(document.components?.schemas).toHaveProperty('CreateUserDto');
    expect(document.components?.schemas).toHaveProperty('UserResponseDto');
    expect(document.components?.schemas).toHaveProperty('CreateTokenDto');
    expect(document.components?.schemas).toHaveProperty('TokenResponseDto');
    expect(document.components?.schemas).toHaveProperty('ErrorResponseDto');
  });
});
