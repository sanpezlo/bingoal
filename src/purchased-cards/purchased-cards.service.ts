import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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

  async create(
    createPurchasedCardDto: CreatePurchasedCardDto,
    user: IUser,
  ): Promise<IPurchasedCard> {
    const [gameDocument] = createPurchasedCardDto.game
      ? await this.gamesRepository.find({
          _id: createPurchasedCardDto.game,
          played: false,
          playing: false,
        })
      : await this.gamesRepository.find({ played: false, playing: false });
    if (!gameDocument) throw new NotFoundException();
    const $game: $Game = this.gamesRepository.toJSON(
      await gameDocument.populate('cards'),
    );

    const $card = ($game.cards as $Card[]).find((card) =>
      createPurchasedCardDto.card
        ? `${card._id}` === `${createPurchasedCardDto.card}`
        : card,
    );
    if (!$card) throw new NotFoundException();

    if (
      !(user.games as string[]).find((game) => `${game}` === `${$game._id}`)
    ) {
      await this.usersRepository.update({ _id: user._id }, {
        $push: {
          games: $game._id,
        },
      } as Partial<User>);
    }

    const $purchasedCard: $PurchasedCard = this.purhcasedCardsRepository.toJSON(
      await this.purhcasedCardsRepository.create({
        user: user._id,
        card: $card._id,
        game: $game._id,
      }),
    );

    await this.gamesRepository.update({ _id: $game._id }, {
      $push: {
        purchasedCards: $purchasedCard._id,
      },
      $pull: {
        cards: $card._id,
      },
    } as Partial<Game>);

    return $purchasedCard;
  }

  async find(
    findPurchasedCardsDto: FindPurchasedCardsDto,
  ): Promise<IPurchasedCard[]> {
    return (
      await this.purhcasedCardsRepository.find(
        {},
        findPurchasedCardsDto.offset,
        findPurchasedCardsDto.limit,
      )
    ).map((purchasedCardDocument) =>
      this.purhcasedCardsRepository.toJSON(purchasedCardDocument),
    );
  }

  async findOne(
    findOnePurchasedCardDto: FindOnePurchasedCardDto,
  ): Promise<IPurchasedCard> {
    const [purchasedCardDocument] = await this.purhcasedCardsRepository.find({
      _id: findOnePurchasedCardDto.id,
    });
    if (!purchasedCardDocument) throw new NotFoundException();
    return this.purhcasedCardsRepository.toJSON(purchasedCardDocument);
  }
}
