import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { tap, concatMap, from, map, of, toArray, Observable } from 'rxjs';

import { IUser } from '@root/users/interfaces/user.interface';
import {
  $PurchasedCard,
  IPurchasedCard,
} from '@root/purchased-cards/interfaces/purchased-card.interface';
import { PurchasedCardsRepository } from '@root/purchased-cards/purchased-cards.repository';
import {
  CreatePurchasedCardDto,
  FindPurchasedCardsDto,
  FindOnePurchasedCardDto,
} from '@root/purchased-cards/dto/purchased-cards.dto';
import { GamesRepository } from '@root/games/games.repository';
import { $Card } from '@root/cards/interfaces/card.interface';
import { UsersRepository } from '@root/users/users.repository';
import { User } from '@root/users/schemas/user.schema';
import { Game } from '@root/games/schemas/game.schema';
import { $Game } from '@root/games/interfaces/game.interface';

@Injectable()
export class PurchasedCardsService {
  constructor(
    private purhcasedCardsRepository: PurchasedCardsRepository,
    @Inject(forwardRef(() => GamesRepository))
    private gamesRepository: GamesRepository,
    private usersRepository: UsersRepository,
  ) {}

  create(
    createPurchasedCardDto: CreatePurchasedCardDto,
    user: IUser,
  ): Observable<IPurchasedCard> {
    return this.gamesRepository
      .rxFind({
        played: false,
        playing: false,
        ...(createPurchasedCardDto.game
          ? { _id: createPurchasedCardDto.game }
          : {}),
      })
      .pipe(
        tap(([gameDocument]) => {
          if (!gameDocument) throw new NotFoundException();
        }),
        concatMap(([gameDocument]) => from(gameDocument.populate('cards'))),
        map((gameDocument) => this.gamesRepository.toJSON(gameDocument)),
        concatMap(($game: $Game) =>
          of(
            ($game.cards as $Card[]).find(($card) =>
              createPurchasedCardDto.card
                ? `${$card._id}` === `${createPurchasedCardDto.card}`
                : $card,
            ),
          ).pipe(
            tap(($card) => {
              if (!$card) throw new NotFoundException();
              if (
                !(user.games as string[]).find(
                  (game) => `${game}` === `${$game._id}`,
                )
              )
                this.usersRepository.rxUpdate({ _id: user._id }, {
                  $push: {
                    games: $game._id,
                  },
                } as Partial<User>);
            }),
            concatMap(($card) =>
              this.purhcasedCardsRepository.rxCreate({
                user: user._id,
                card: $card._id,
                game: $game._id,
              }),
            ),
            map((purchasedCardDocument) =>
              this.purhcasedCardsRepository.toJSON(purchasedCardDocument),
            ),
          ),
        ),
        tap(($purchasedCard: $PurchasedCard) => {
          this.gamesRepository.rxUpdate(
            { _id: $purchasedCard.game as string },
            {
              $push: {
                purchasedCards: $purchasedCard._id,
              },
              $pull: {
                cards: $purchasedCard.card,
              },
            } as Partial<Game>,
          );
        }),
      );
  }

  find(
    findPurchasedCardsDto: FindPurchasedCardsDto,
  ): Observable<IPurchasedCard[]> {
    return this.purhcasedCardsRepository
      .rxFind({}, findPurchasedCardsDto.offset, findPurchasedCardsDto.limit)
      .pipe(
        concatMap((purchasedCardsDocument) => from(purchasedCardsDocument)),
        map((purchasedCardDocument) =>
          this.purhcasedCardsRepository.toJSON(purchasedCardDocument),
        ),
        toArray(),
      );
  }

  findOne(
    findOnePurchasedCardDto: FindOnePurchasedCardDto,
  ): Observable<IPurchasedCard> {
    return this.purhcasedCardsRepository
      .rxFind({
        _id: findOnePurchasedCardDto.id,
      })
      .pipe(
        tap(([purchasedCardDocument]) => {
          if (!purchasedCardDocument) throw new NotFoundException();
        }),
        map(([purchasedCardDocument]) =>
          this.purhcasedCardsRepository.toJSON(purchasedCardDocument),
        ),
      );
  }
}
