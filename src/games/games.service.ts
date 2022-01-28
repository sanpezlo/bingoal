import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { Document } from 'mongoose';

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

  async create(): Promise<IGame> {
    const $cards = (await this.cardsRepository.find({})).map((cardDocument) =>
      this.cardsRepository.toJSON(cardDocument),
    );
    return this.gamesRepository.toJSON(
      await this.gamesRepository.create({ cards: $cards }),
    );
  }

  async find(findGamesDto: FindGamesDto): Promise<IGame[]> {
    return (
      await this.gamesRepository.find(
        {},
        findGamesDto.offset,
        findGamesDto.limit,
      )
    ).map((gameDocument) => this.gamesRepository.toJSON(gameDocument));
  }

  async findOne(findOneGameDto: FindOneGameDto): Promise<IGame> {
    const [gameDocument] = await this.gamesRepository.find({
      _id: findOneGameDto.id,
    });
    if (!gameDocument) throw new NotFoundException();
    return this.gamesRepository.toJSON(gameDocument);
  }

  async createBall(createBallGameDto: CreateBallGameDto): Promise<IGame> {
    const [gameDocument] = await this.gamesRepository.find({
      _id: createBallGameDto.id,
      played: false,
    });
    if (!gameDocument) throw new NotFoundException();

    const gameDocumentPopulated = await gameDocument.populate({
      path: 'purchasedCards',
      populate: {
        path: 'card',
      },
    });

    if (!gameDocument.playing)
      this.gamesGateway.emitGame(gameDocument._id.toString(), {
        playing: true,
      });

    const indexRemainingBall = Math.floor(
      Math.random() * gameDocument.balls.length,
    );

    const ball: number = gameDocument.balls[indexRemainingBall];

    await this.gamesRepository.update({ _id: gameDocument._id }, {
      playing: true,
      $push: {
        ballsPlayed: gameDocument.balls[indexRemainingBall],
      },
      $pull: {
        balls: gameDocument.balls[indexRemainingBall],
      },
    } as Partial<Game>);

    this.gamesGateway.emitBall(gameDocument._id.toString(), ball);

    const winners = await this.getWinners(
      gameDocumentPopulated.purchasedCards as (PurchasedCard &
        Document<any, any, any>)[],
      ball,
      gameDocument._id,
    );

    if (winners.length)
      this.gamesGateway.emitWinners(gameDocument._id.toString(), winners);

    const findOneGameDto: FindOneGameDto = { id: gameDocument._id };
    return this.findOne(findOneGameDto);
  }

  private async getWinners(
    purchasedCardsPopulated: (PurchasedCard & Document<any, any, any>)[],
    ball: number,
    gameId: string,
  ): Promise<string[]> {
    const winners: string[] = [];

    for (const purchasedCard of purchasedCardsPopulated) {
      for (let i = 0; i < (purchasedCard.card as Card).data.length; i++) {
        if ((purchasedCard.card as Card).data[i] === ball) {
          purchasedCard.score[i] = true;

          await this.purchasedCardsRepository.update(
            { _id: purchasedCard._id },
            { score: purchasedCard.score },
          );

          if (purchasedCard.score.every((value) => value === true)) {
            winners.push(purchasedCard.user as string);

            await this.gamesRepository.update({ _id: gameId }, {
              playing: false,
              played: true,

              $push: {
                winningCards: purchasedCard._id,
              },
            } as Partial<Game>);
          }
        }
      }
    }

    return winners;
  }
}
