import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';

import { _users, createUsers } from '@test/utils/users';
import { global } from '@root/global';
import { imports, close } from '@test/utils/app';
import { UsersModule } from '@root/users/users.module';
import { UsersRepository } from '@root/users/users.repository';
import { createAccessToken } from '@test/utils/auth';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let configService: ConfigService;
  let token: string;
  let id: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...imports(), UsersModule],
    }).compile();

    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    const [_user] = _users;
    const $user = await createUsers(usersRepository, _user);

    token = await createAccessToken(configService, $user._id);

    app = moduleFixture.createNestApplication();
    global(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await close();
  });

  describe('[POST] / (v1)', () => {
    test('should return a bad request exception', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'name must be a string',
            'name should not be empty',
            'email must be an email',
            'email should not be empty',
            'password must be a string',
            'password should not be empty',
          ],
          error: 'Bad Request',
        });
    });

    test('should return a forbidden exception', async () => {
      const [_user] = _users;
      return request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          name: _user.name,
          email: _user.email,
          password: _user.password,
        })
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden',
        });
    });

    test('should return the user data', async () => {
      const [, { password, ...user }] = _users;
      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .send({
          name: user.name,
          email: user.email,
          password: password,
        })
        .expect(201);

      expect(response.body).toMatchObject(user);
      expect(response.body.password).toBeUndefined();

      id = response.body._id;
    });
  });

  describe('[GET] / (v1)', () => {
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return the user data', async () => {
      const users = _users.map((_user) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = _user;
        return user;
      });
      const response = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toMatchObject(users);
    });
  });

  describe('[GET] /me (v1)', () => {
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/me')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return the user data', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [{ password, ...user }] = _users;
      const response = await request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toMatchObject(user);
      expect(response.body.password).toBeUndefined();
    });
  });

  describe('[GET] /:id (v1)', () => {
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/users/${id}`)
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return the user data', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [, { password, ...user }] = _users;
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${id}`)
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toMatchObject(user);
    });
  });

  describe('[PUT] / (v1)', () => {
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .put('/api/v1/users')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return a bad request exception', async () => {
      return request(app.getHttpServer())
        .put('/api/v1/users')
        .set('Authorization', token)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'password must be a string',
            'password should not be empty',
          ],
          error: 'Bad Request',
        });
    });

    test('should return a bad request exception', async () => {
      const [_user] = _users;
      return request(app.getHttpServer())
        .put('/api/v1/users')
        .set('Authorization', token)
        .send({
          name: '',
          email: '',
          password: _user.password,
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'name should not be empty',
            'email must be an email',
            'email should not be empty',
          ],
          error: 'Bad Request',
        });
    });

    test('should return a forbidden exception', async () => {
      const [, _user] = _users;
      return request(app.getHttpServer())
        .put('/api/v1/users')
        .set('Authorization', token)
        .send({
          name: _user.name + '1',
          password: _user.password,
        })
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden',
        });
    });

    test('should return a forbidden exception', async () => {
      const [_user1, _user2] = _users;
      return request(app.getHttpServer())
        .put('/api/v1/users')
        .set('Authorization', token)
        .send({
          email: _user2.email,
          password: _user1.password,
        })
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden',
        });
    });

    test('should return the user data', async () => {
      const [_user1, _user2] = _users;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = _user1;
      user.name = _user2.name;
      user.email = _user2.email + '.co';
      const response = await request(app.getHttpServer())
        .put('/api/v1/users')
        .set('Authorization', token)
        .send({
          name: _user2.name,
          email: _user2.email + '.co',
          password: _user1.password,
        })
        .expect(200);

      expect(response.body).toMatchObject(user);
      expect(response.body.password).toBeUndefined();
    });
  });
});
