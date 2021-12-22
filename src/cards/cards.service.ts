import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CardsRepository } from '@root/cards/cards.repository';
import { CreateCardDto, FindOneCardDto } from '@root/cards/dto/cards.dto';
import { ICard } from '@root/cards/interfaces/card.interface';
import { GamesRepository } from '@root/games/games.repository';
import { $Game } from '@root/games/interfaces/game.interface';

@Injectable()
export class CardsService {
  constructor(
    private cardsRepository: CardsRepository,
    @Inject(forwardRef(() => GamesRepository))
    private gamesRepository: GamesRepository,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<ICard> {
    if (!createCardDto.data) createCardDto.data = await this.createData();

    const [card] = await this.cardsRepository.find({
      data: { $all: createCardDto.data } as unknown as number[],
    });
    if (card) return card;

    const newCard = await this.cardsRepository.create({
      data: createCardDto.data,
    });

    await this.gamesRepository.update({ played: false, playing: false }, {
      $push: { cards: newCard },
    } as Partial<$Game>);

    return newCard;
  }

  async find(): Promise<ICard[]> {
    return await this.cardsRepository.find({});
  }

  async findOne(findOneCardDto: FindOneCardDto): Promise<ICard> {
    const [$card] = await this.cardsRepository.find({ _id: findOneCardDto.id });
    if (!$card) throw new NotFoundException();
    return $card;
  }

  async createData(): Promise<number[]> {
    const result: number[] = [];
    const B = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const I = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    const N = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
    const G = [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
    const O = [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75];

    for (let i = 0; i < 5; i++)
      result.push(...B.splice(Math.floor(Math.random() * B.length), 1));

    for (let i = 0; i < 5; i++)
      result.push(...I.splice(Math.floor(Math.random() * I.length), 1));

    for (let i = 0; i < 5; i++) {
      if (i === 2) result.push(0);
      else {
        result.push(...N.splice(Math.floor(Math.random() * N.length), 1));
      }
    }

    for (let i = 0; i < 5; i++)
      result.push(...G.splice(Math.floor(Math.random() * G.length), 1));

    for (let i = 0; i < 5; i++)
      result.push(...O.splice(Math.floor(Math.random() * O.length), 1));

    const cards = await this.cardsRepository.find({
      data: { $all: result } as unknown as number[],
    });
    if (cards.length) return this.createData();
    return result;
  }
}
