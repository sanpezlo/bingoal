import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';

import { global } from '@root/global';
import { imports, close } from '@test/utils/app';
import { GamesModule } from '@root/games/games.module';
import { createUsers, _users } from '@test/utils/users';
import { createCards, _cards } from '@test/utils/cards';
import { UsersRepository } from '@root/users/users.repository';
import { createAccessToken } from '@test/utils/auth';
import { UsersModule } from '@root/users/users.module';
import { CardsRepository } from '@root/cards/cards.repository';
import { _games } from './utils/games';
import { Card } from '@root/cards/schemas/card.schema';

describe('GamesController (e2e)', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let cardssRepository: CardsRepository;
  let configService: ConfigService;
  let token: string;
  let id: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...imports(), UsersModule, GamesModule],
    }).compile();

    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    cardssRepository = moduleFixture.get<CardsRepository>(CardsRepository);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    const [_user] = _users;
    const $user = await createUsers(usersRepository, _user);

    const [_card] = _cards;
    const $card = await createCards(cardssRepository, _card);

    const [_game] = _games;
    _game.cards.push($card._id as Card & string);

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
        .post('/api/v1/games')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return the game data', async () => {
      const [_game] = _games;
      const response = await request(app.getHttpServer())
        .post('/api/v1/games')
        .set('Authorization', token)
        .expect(201);

      expect(response.body).toMatchObject(_game);

      id = response.body._id;
    });
  });

  describe('[GET] / (v1)', () => {
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .get('/api/v1/games')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return the game data', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/games')
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toMatchObject(_games);
    });
  });

  describe('[GET] /:id (v1)', () => {
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/games/${id}`)
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return the card data', async () => {
      const [_game] = _games;
      const response = await request(app.getHttpServer())
        .get(`/api/v1/games/${id}`)
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toMatchObject(_game);
    });
  });
});
