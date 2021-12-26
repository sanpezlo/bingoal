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
    const $cards = (await this.cardsRepository.find({})).map((cardDocument) =>
      this.cardsRepository.toJSON(cardDocument),
    );
    return this.gamesRepository.toJSON(
      await this.gamesRepository.create({ cards: $cards }),
    );
  }

  async find(): Promise<IGame[]> {
    return (await this.gamesRepository.find({})).map((gameDocument) =>
      this.gamesRepository.toJSON(gameDocument),
    );
  }

  async findOne(findOneGameDto: FindOneGameDto): Promise<IGame> {
    const [gameDocument] = await this.gamesRepository.find({
      _id: findOneGameDto.id,
    });
    if (!gameDocument) throw new NotFoundException();
    return this.gamesRepository.toJSON(gameDocument);
  }
}
