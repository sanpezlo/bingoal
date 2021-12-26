import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';

import { global } from '@root/global';
import { imports, close } from '@test/utils/app';
import { CardsModule } from '@root/cards/cards.module';
import { createUser, _users } from '@test/utils/users';
import { createCard, _cards } from '@test/utils/cards';
import { UsersRepository } from '@root/users/users.repository';
import { createAccessToken } from '@test/utils/auth';
import { UsersModule } from '@root/users/users.module';
import { CardsRepository } from '@root/cards/cards.repository';

describe('CardsController (e2e)', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let cardssRepository: CardsRepository;
  let configService: ConfigService;
  let token: string;
  let id: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...imports(), UsersModule, CardsModule],
    }).compile();

    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    cardssRepository = moduleFixture.get<CardsRepository>(CardsRepository);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    const [_user] = _users;
    const $user = await createUser(usersRepository, _user);

    const [_card] = _cards;
    await createCard(cardssRepository, _card);

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
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .post('/api/v1/cards')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return a bad request exception', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/cards')
        .set('Authorization', token)
        .send({ data: '' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'data must be an valid data',
            'data must contain not more than 25 elements',
            'data must contain at least 25 elements',
            'data must be an array',
            'data should not be empty',
          ],
          error: 'Bad Request',
        });
    });

    test('should return the card data', async () => {
      const [_card] = _cards;
      const response = await request(app.getHttpServer())
        .post('/api/v1/cards')
        .set('Authorization', token)
        .send({
          data: _card.data,
        })
        .expect(201);

      expect(response.body).toMatchObject(_card);

      id = response.body._id;
    });

    test('should return the card data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/cards')
        .set('Authorization', token)
        .expect(201);

      _cards.push({ data: response.body.data });
    });
  });

  describe('[GET] / (v1)', () => {
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .get('/api/v1/cards')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return the card data', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/cards')
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toMatchObject(_cards);
    });
  });

  describe('[GET] /:id (v1)', () => {
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/cards/${id}`)
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return a bad request exception', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/cards/${id.slice(0, -2)}`)
        .set('Authorization', token)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['id must be longer than or equal to 24 characters'],
          error: 'Bad Request',
        });
    });

    test('should return a bad request exception', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/cards/${id}1`)
        .set('Authorization', token)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['id must be shorter than or equal to 24 characters'],
          error: 'Bad Request',
        });
    });

    test('should return the card data', async () => {
      const [_card] = _cards;
      const response = await request(app.getHttpServer())
        .get(`/api/v1/cards/${id}`)
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toMatchObject(_card);
    });
  });
});
