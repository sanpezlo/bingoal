import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';

import { createUser, _users } from '@test/utils/users';
import { global } from '@root/global';
import { imports, close } from '@test/utils/app';
import { AuthModule } from '@root/auth/auth.module';
import { UsersRepository } from '@root/users/users.repository';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let configService: ConfigService;
  let token: string;
  let refresh: string;
  let expectedJwtResponse;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...imports(), AuthModule],
    }).compile();

    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    const [_user] = _users;
    await createUser(usersRepository, _user);

    app = moduleFixture.createNestApplication();
    global(app);
    await app.init();

    expectedJwtResponse = {
      token_type: 'Bearer',
      access_token: expect.stringMatching(
        /^[A-Za-z0-9-=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      ),
      expires_in: await configService.get<number>('token.access.expires_in'),
      refresh_token: expect.stringMatching(
        /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
      ),
      refresh_token_expires_in: await configService.get<number>(
        'token.refresh.expires_in',
      ),
    };
  });

  afterAll(async () => {
    await app.close();
    await close();
  });

  describe('[POST] /login (v1)', () => {
    test('should return an unauthorised exception', async () => {
      const [_user] = _users;
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: _user.email + '.co',
          password: _user.password,
        })
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return the jwt', async () => {
      const [_user] = _users;
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: _user.email, password: _user.password })
        .expect(201);

      expect(response.body).toMatchObject(expectedJwtResponse);

      token = response.body.token_type + ' ' + response.body.access_token;
      refresh = response.body.refresh_token;
    });
  });

  describe('[POST] /refresh (v1)', () => {
    test('should return a bad request exception', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'refresh must be a jwt string',
            'refresh should not be empty',
          ],
          error: 'Bad Request',
        });
    });

    test('should return the jwt', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refresh: refresh,
        })
        .expect(201);

      expect(response.body).toMatchObject(expectedJwtResponse);
    });
  });

  describe('[PUT] /password (v1)', () => {
    test('should return an unauthorised exception', async () => {
      return request(app.getHttpServer())
        .put('/api/v1/auth/password')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    test('should return a bad request exception', async () => {
      return request(app.getHttpServer())
        .put('/api/v1/auth/password')
        .set('Authorization', token)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'password must be a string',
            'password should not be empty',
            'newPassword must be a string',
            'newPassword should not be empty',
          ],
          error: 'Bad Request',
        });
    });

    test('should return a forbidden exception', async () => {
      const [_user] = _users;
      return request(app.getHttpServer())
        .put('/api/v1/auth/password')
        .set('Authorization', token)
        .send({
          password: _user.password + '1',
          newPassword: _user.password,
        })
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden',
        });
    });

    test('should return the jwt', async () => {
      const [_user] = _users;
      const response = await request(app.getHttpServer())
        .put('/api/v1/auth/password')
        .set('Authorization', token)
        .send({
          password: _user.password,
          newPassword: _user.password + '1',
        })
        .expect(200);

      expect(response.body).toMatchObject(expectedJwtResponse);
    });
  });
});
