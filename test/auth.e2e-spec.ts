import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';

import { createUsers, $users } from '@test/utils/users';
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

    await createUsers(usersRepository);

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

  describe('/login (v1)', () => {
    test('should return an unauthorised exception', async () => {
      const $user = $users[0];
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: $user.email,
          password: '',
        })
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return the jwt', async () => {
      const $user = $users[0];
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: $user.email, password: $user.password })
        .expect(201);

      expect(response.body).toMatchObject(expectedJwtResponse);

      token = response.body.token_type + ' ' + response.body.access_token;
      refresh = response.body.refresh_token;
    });
  });

  describe('/refresh (v1)', () => {
    test('should return an bad request exception', async () => {
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

    test('should return an unauthorised exception', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/refresh')
        .send({
          refresh: refresh,
        })
        .expect(201);

      expect(response.body).toMatchObject(expectedJwtResponse);
    });
  });

  describe('/profile (v1)', () => {
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return the user data', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...$user } = $users[0];
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/profile')
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toMatchObject($user);
      expect(response.body.password).toBeUndefined();
    });
  });
});
