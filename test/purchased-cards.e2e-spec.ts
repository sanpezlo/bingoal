import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';

import { global } from '@root/global';
import { imports, close } from '@test/utils/app';
import { PurchasedCardsModule } from '@root/purchased-cards/purchased-cards.module';
import { createUser, _users } from '@test/utils/users';
import { createCard, _cards } from '@test/utils/cards';
import { UsersRepository } from '@root/users/users.repository';
import { createAccessToken } from '@test/utils/auth';
import { CardsRepository } from '@root/cards/cards.repository';
import { createGame, _games } from '@test/utils/games';
import { PurchasedCardsRepository } from '@root/purchased-cards/purchased-cards.repository';
import { GamesRepository } from '@root/games/games.repository';
import { createPurchasedCard, _purchasedCards } from './utils/purchased-cards';

describe('PurchasedCardsController (e2e)', () => {
  let app: INestApplication;
  let purchasedCardsRepository: PurchasedCardsRepository;
  let usersRepository: UsersRepository;
  let cardssRepository: CardsRepository;
  let gamesRepository: GamesRepository;
  let configService: ConfigService;
  let token: string;
  let id: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...imports(), PurchasedCardsModule],
    }).compile();

    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    cardssRepository = moduleFixture.get<CardsRepository>(CardsRepository);
    purchasedCardsRepository = moduleFixture.get<PurchasedCardsRepository>(
      PurchasedCardsRepository,
    );
    gamesRepository = moduleFixture.get<GamesRepository>(GamesRepository);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    const [_user] = _users;
    const $user = await createUser(usersRepository, _user);

    const [_card1, _card2] = _cards;
    const $card1 = await createCard(cardssRepository, _card1);
    const $card2 = await createCard(cardssRepository, _card2);

    const [_game] = _games;
    (_game.cards as string[]).push($card1._id, $card2._id);
    const $game = await createGame(gamesRepository, _game);

    _purchasedCards.push(
      {
        card: $card1._id,
        game: $game._id,
        user: $user._id,
      },
      { card: $card2._id, game: $game._id, user: $user._id },
    );
    const [_purchasedCard] = _purchasedCards;
    await createPurchasedCard(
      purchasedCardsRepository,
      gamesRepository,
      _purchasedCard,
    );

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
        .post('/api/v1/purchased-cards')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return a bad request exception', async () => {
      return request(app.getHttpServer())
        .post('/api/v1/purchased-cards')
        .set('Authorization', token)
        .send({
          game: 0,
          card: 0,
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'card must be longer than or equal to 24 characters',
            'card must be shorter than or equal to 24 characters',
            'card must be a string',
            'game must be longer than or equal to 24 characters',
            'game must be shorter than or equal to 24 characters',
            'game must be a string',
          ],
          error: 'Bad Request',
        });
    });

    test('should return a not foubd exception', async () => {
      const [_purchasedCard] = _purchasedCards;
      return request(app.getHttpServer())
        .post('/api/v1/purchased-cards')
        .set('Authorization', token)
        .send(_purchasedCard)
        .expect(404)
        .expect({
          message: 'Not Found',
          statusCode: 404,
        });
    });

    test('should return the purchased card data', async () => {
      const [, _purchasedCard] = _purchasedCards;
      const response = await request(app.getHttpServer())
        .post('/api/v1/purchased-cards')
        .set('Authorization', token)
        .expect(201);

      expect(response.body).toMatchObject(_purchasedCard);

      id = response.body._id;
    });
  });

  describe('[GET] / (v1)', () => {
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .get('/api/v1/purchased-cards')
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return the game data', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/purchased-cards')
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toMatchObject(_purchasedCards);
    });
  });

  describe('[GET] /:id (v1)', () => {
    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/purchased-cards/${id}`)
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return a bad request exception', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/purchased-cards/${id.slice(0, -2)}`)
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
        .get(`/api/v1/purchased-cards/${id}1`)
        .set('Authorization', token)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['id must be shorter than or equal to 24 characters'],
          error: 'Bad Request',
        });
    });

    test('should return the card data', async () => {
      const [, _purchasedCard] = _purchasedCards;
      const response = await request(app.getHttpServer())
        .get(`/api/v1/purchased-cards/${id}`)
        .set('Authorization', token)
        .expect(200);

      expect(response.body).toMatchObject(_purchasedCard);
    });
  });
});
