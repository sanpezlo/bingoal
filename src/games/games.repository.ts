import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Game, GameDocument } from '@root/games/schemas/game.schema';
import { $Game } from '@root/games/interfaces/game.interface';

@Injectable()
export class GamesRepository {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async create(game: Game): Promise<$Game> {
    return (await this.gameModel.create(game)).toJSON() as $Game;
  }

  async find(filter: Partial<$Game>): Promise<$Game[]> {
    return (await this.gameModel.find(filter)).map((game) =>
      game.toJSON(),
    ) as $Game[];
  }

  async update(filter: Partial<$Game>, update: Partial<Game>): Promise<void> {
    await this.gameModel.updateMany(filter, update);
  }

  async delete(filter: Partial<$Game>): Promise<void> {
    await this.gameModel.deleteMany(filter);
  }
}
