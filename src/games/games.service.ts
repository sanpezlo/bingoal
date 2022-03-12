import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { Document } from 'mongoose';
import {
  Observable,
  from,
  map,
  toArray,
  tap,
  of,
  filter,
  switchMap,
  delayWhen,
} from 'rxjs';

import { CardsRepository } from '@root/cards/cards.repository';
import { GamesRepository } from '@root/games/games.repository';
import { IGame } from '@root/games/interfaces/game.interface';
import {
  CreateBallGameDto,
  FindGamesDto,
  FindOneGameDto,
} from '@root/games/dto/games.dto';
import { GamesGateway } from '@root/games/games.gateway';
import { PurchasedCard } from '@root/purchased-cards/schemas/purchased-card.schema';
import { Card } from '@root/cards/schemas/card.schema';
import { PurchasedCardsRepository } from '@root/purchased-cards/purchased-cards.repository';
import { Game } from '@root/games/schemas/game.schema';

@Injectable()
export class GamesService {
  constructor(
    private gamesRepository: GamesRepository,
    @Inject(forwardRef(() => CardsRepository))
    private cardsRepository: CardsRepository,
    @Inject(forwardRef(() => PurchasedCardsRepository))
    private purchasedCardsRepository: PurchasedCardsRepository,
    private gamesGateway: GamesGateway,
  ) {}

  create(): Observable<IGame> {
    return this.cardsRepository.find({}).pipe(
      switchMap((cardsDocument) => from(cardsDocument)),
      map((cardDocument) => this.cardsRepository.toJSON(cardDocument)),
      toArray(),
      switchMap(($cards) => this.gamesRepository.create({ cards: $cards })),
      map((gameDocument) => this.gamesRepository.toJSON(gameDocument)),
    );
  }

  find(findGamesDto: FindGamesDto): Observable<IGame[]> {
    return this.gamesRepository
      .find({}, findGamesDto.offset, findGamesDto.limit)
      .pipe(
        switchMap((gamesDocument) => from(gamesDocument)),
        map((gameDocument) => this.gamesRepository.toJSON(gameDocument)),
        toArray(),
      );
  }

  findOne(findOneGameDto: FindOneGameDto) {
    return this.gamesRepository.find({ _id: findOneGameDto.id }).pipe(
      tap(([gameDocument]) => {
        if (!gameDocument) throw new NotFoundException();
      }),
      map(([gameDocument]) => this.gamesRepository.toJSON(gameDocument)),
    );
  }

  createBall(createBallGameDto: CreateBallGameDto) {
    return this.gamesRepository
      .find({
        _id: createBallGameDto.id,
        played: false,
      })
      .pipe(
        tap(([gameDocument]) => {
          if (!gameDocument) throw new NotFoundException();
        }),
        switchMap(([gameDocument]) =>
          from(
            gameDocument.populate({
              path: 'purchasedCards',
              populate: {
                path: 'card',
              },
            }),
          ),
        ),
        tap((gameDocumentPopulated) => {
          if (!gameDocumentPopulated.playing)
            this.gamesGateway.emitGame(gameDocumentPopulated._id.toString(), {
              playing: true,
            });
        }),
        delayWhen((gameDocumentPopulated) =>
          this.getBall(gameDocumentPopulated).pipe(
            delayWhen((ball) =>
              this.checkWinners(
                gameDocumentPopulated.purchasedCards as (PurchasedCard &
                  Document<any, any, any>)[],
                ball,
                gameDocumentPopulated._id.toString(),
              ),
            ),
          ),
        ),
        switchMap((gameDocumentPopulated) =>
          this.findOne({ id: gameDocumentPopulated._id }),
        ),
      );
  }

  private getBall(gameDocumentPopulated: Game & Document<any, any, any>) {
    return of(
      Math.floor(Math.random() * gameDocumentPopulated.balls.length),
    ).pipe(
      map((indexBall) => gameDocumentPopulated.balls[indexBall]),
      tap((ball) => {
        this.gamesRepository.update({ _id: gameDocumentPopulated._id }, {
          playing: true,
          $push: {
            ballsPlayed: ball,
          },
          $pull: {
            balls: ball,
          },
        } as Partial<Game>);
      }),
      tap((ball) => {
        this.gamesGateway.emitBall(gameDocumentPopulated._id.toString(), ball);
      }),
    );
  }

  private checkWinners(
    purchasedCardsPopulated: (PurchasedCard & Document<any, any, any>)[],
    ball: number,
    gameId: string,
  ) {
    return from(purchasedCardsPopulated).pipe(
      filter((purchasedCardPopulated) =>
        (purchasedCardPopulated.card as Card).data.includes(ball),
      ),
      delayWhen((purchasedCardPopulated) =>
        this.getScore(purchasedCardPopulated, ball).pipe(
          filter((score) => !score.includes(false)),
        ),
      ),
      tap((purchasedCardPopulated) => {
        this.gamesRepository.update({ _id: gameId }, {
          playing: false,
          played: true,

          $push: {
            winningCards: purchasedCardPopulated._id,
          },
        } as Partial<Game>);
      }),
      map((purchasedCardPopulated) => purchasedCardPopulated.user as string),
      toArray(),
      tap((winners) => {
        if (winners.length) this.gamesGateway.emitWinners(gameId, winners);
      }),
    );
  }

  private getScore(
    purchasedCardPopulated: PurchasedCard & Document<any, any, any>,
    ball: number,
  ) {
    return of((purchasedCardPopulated.card as Card).data.indexOf(ball)).pipe(
      map((index) =>
        Object.assign([...purchasedCardPopulated.score], {
          [index]: true,
        }),
      ),
      tap((score) => {
        this.purchasedCardsRepository.update(
          { _id: purchasedCardPopulated._id },
          {
            score: score,
          },
        );
      }),
    );
  }
}
