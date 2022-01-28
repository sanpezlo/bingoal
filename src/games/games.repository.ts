import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

import { Game, GameDocument } from '@root/games/schemas/game.schema';
import { $Game } from '@root/games/interfaces/game.interface';

@Injectable()
export class GamesRepository {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async create(game: Game): Promise<Game & Document<any, any, any>> {
    return await this.gameModel.create(game);
  }

  async find(
    filter: Partial<$Game>,
    skip = 0,
    limit = 20,
  ): Promise<(Game & Document<any, any, any>)[]> {
    return await this.gameModel.find(filter).skip(skip).limit(limit);
  }

  async update(filter: Partial<$Game>, update: Partial<Game>): Promise<void> {
    await this.gameModel.updateMany(filter, update);
  }

  async delete(filter: Partial<$Game>): Promise<void> {
    await this.gameModel.deleteMany(filter);
  }

  toJSON(gameDocument: Game & Document<any, any, any>) {
    return gameDocument.toJSON() as $Game;
  }
}
