import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { CardsRepository } from '@root/cards/cards.repository';
import { GamesRepository } from '@root/games/games.repository';
import { IGame } from '@root/games/interfaces/game.interface';
import { FindOneGameDto } from '@root/games/dto/games.dto';

@Injectable()
export class GamesService {
  constructor(
    private gamesRepository: GamesRepository,
    @Inject(forwardRef(() => CardsRepository))
    private cardsRepository: CardsRepository,
  ) {}

  async create(): Promise<IGame> {
    const $cards = await this.cardsRepository.find({});
    return await this.gamesRepository.create({ cards: $cards });
  }

  async find(): Promise<IGame[]> {
    return await this.gamesRepository.find({});
  }

  async findOne(findOneGameDto: FindOneGameDto): Promise<IGame> {
    const [$game] = await this.gamesRepository.find({ _id: findOneGameDto.id });
    if (!$game) throw new NotFoundException();
    return $game;
  }
}
