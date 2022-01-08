import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { io, Socket } from 'socket.io-client';

import { global } from '@root/global';
import { imports, close } from '@test/utils/app';
import { GamesModule } from '@root/games/games.module';
import { createUser, _users } from '@test/utils/users';
import { createCard, _cards } from '@test/utils/cards';
import { UsersRepository } from '@root/users/users.repository';
import { createAccessToken } from '@test/utils/auth';
import { UsersModule } from '@root/users/users.module';
import { CardsRepository } from '@root/cards/cards.repository';
import { createGame, _games } from '@test/utils/games';
import { GamesRepository } from '@root/games/games.repository';
import { PurchasedCardsRepository } from '@root/purchased-cards/purchased-cards.repository';
import {
  createPurchasedCard,
  _purchasedCards,
} from '@test/utils/purchased-cards';
import { IGame } from '@root/games/interfaces/game.interface';

describe('GamesController (e2e)', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let cardssRepository: CardsRepository;
  let gamesRepository: GamesRepository;
  let purchasedCardsRepository: PurchasedCardsRepository;
  let configService: ConfigService;
  let token1: string;
  let token2: string;
  let id: string;
  let id_purchasedCard: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...imports(), UsersModule, GamesModule],
    }).compile();

    usersRepository = moduleFixture.get<UsersRepository>(UsersRepository);
    cardssRepository = moduleFixture.get<CardsRepository>(CardsRepository);
    gamesRepository = moduleFixture.get<GamesRepository>(GamesRepository);
    purchasedCardsRepository = moduleFixture.get<PurchasedCardsRepository>(
      PurchasedCardsRepository,
    );
    configService = moduleFixture.get<ConfigService>(ConfigService);

    const [_user1, _user2] = _users;
    const $user1 = await createUser(usersRepository, _user1);
    const $user2 = await createUser(usersRepository, _user2);

    const [_card] = _cards;
    const $card = await createCard(cardssRepository, _card);

    const [_game1, _game2] = _games;
    (_game2.cards as string[]).push($card._id);
    const $game = await createGame(gamesRepository, _game1);

    _purchasedCards.push({
      card: $card._id,
      game: $game._id,
      user: $user1._id,
    });
    const [_purchasedCard] = _purchasedCards;
    id_purchasedCard = (
      await createPurchasedCard(
        purchasedCardsRepository,
        gamesRepository,
        _purchasedCard,
      )
    )._id;

    token1 = await createAccessToken(configService, $user1._id);
    token2 = await createAccessToken(configService, $user2._id);

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

    test('should return a forbidden exception', () => {
      return request(app.getHttpServer())
        .post('/api/v1/games')
        .set('Authorization', token2)
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
    });

    test('should return the game data', async () => {
      const [, _game] = _games;
      const response = await request(app.getHttpServer())
        .post('/api/v1/games')
        .set('Authorization', token1)
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
        .set('Authorization', token1)
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

    test('should return a bad request exception', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/games/${id.slice(0, -2)}`)
        .set('Authorization', token1)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['id must be longer than or equal to 24 characters'],
          error: 'Bad Request',
        });
    });

    test('should return a bad request exception', () => {
      return request(app.getHttpServer())
        .get(`/api/v1/games/${id}1`)
        .set('Authorization', token1)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['id must be shorter than or equal to 24 characters'],
          error: 'Bad Request',
        });
    });

    test('should return the card data', async () => {
      const [, _game] = _games;
      const response = await request(app.getHttpServer())
        .get(`/api/v1/games/${id}`)
        .set('Authorization', token1)
        .expect(200);

      expect(response.body).toMatchObject(_game);
    });
  });

  describe('[POST] /ball/:id (v1)', () => {
    let socket: Socket;
    let baseAddress: string;

    beforeAll(() => {
      const address = app.getHttpServer().listen().address();
      baseAddress = `http://[${address.address}]:${address.port}`;

      const [_purchasedCard] = _purchasedCards;
      id = _purchasedCard.game.toString();
    });

    afterAll(() => {
      socket.close();
    });

    test('should not be a handshake', (done) => {
      socket = io(baseAddress);
      socket.on('connect_error', function () {
        done();
      });
    });

    test('should be a handshake', (done) => {
      socket = io(baseAddress, {
        extraHeaders: {
          Authorization: token1,
        },
      });

      socket.on('connect', function () {
        done();
      });
    });

    test('should return a socket exception', (done) => {
      socket.emit('join');
      socket.on('exception', function (data) {
        expect(data).toStrictEqual({
          status: 'error',
          message: [
            'game must be longer than or equal to 24 characters',
            'game must be shorter than or equal to 24 characters',
            'game must be a string',
          ],
        });
        done();
      });
      socket.emit('join', { game: id });
    });

    test('should return an unauthorised exception', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/games/ball/${id}`)
        .expect(401)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    test('should return a forbidden exception', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/games/ball/${id}`)
        .set('Authorization', token2)
        .expect(403)
        .expect({
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        });
    });

    test('should return a bad request exception', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/games/ball/${id.slice(0, -2)}`)
        .set('Authorization', token1)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['id must be longer than or equal to 24 characters'],
          error: 'Bad Request',
        });
    });

    test('should return a bad request exception', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/games/ball/${id}1`)
        .set('Authorization', token1)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['id must be shorter than or equal to 24 characters'],
          error: 'Bad Request',
        });
    });

    describe('should return the game data with winner', () => {
      let [_game] = _games;

      beforeAll(() => {
        _game.played = false;
        _game.ballsPlayed = [];
        _game.winningCards = [];

        socket.on('game', function (data) {
          _game = { ..._game, ...data };
        });
        socket.on('ball', function (data) {
          _game.ballsPlayed.push(data);
        });
        socket.on('winners', function () {
          (_game.winningCards as string[]).push(id_purchasedCard);
        });
      });

      for (let i = 1; i <= 75; i++) {
        it(`ball ${i}`, async () => {
          if (!_game.played) {
            const response = await request(app.getHttpServer())
              .post(`/api/v1/games/ball/${id}`)
              .set('Authorization', token1)
              .expect(201);

            expect(response.body).toMatchObject(_game);
            expect((response.body as IGame).ballsPlayed.length).toBe(i);
            expect((response.body as IGame).balls.length).toBe(75 - i);
          } else
            return request(app.getHttpServer())
              .post(`/api/v1/games/ball/${id}`)
              .set('Authorization', token1)
              .expect(404)
              .expect({ statusCode: 404, message: 'Not Found' });
        });
      }
    });
  });
});
