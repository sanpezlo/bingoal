import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Observable, from } from 'rxjs';

import { Game, GameDocument } from '@root/games/schemas/game.schema';
import { $Game } from '@root/games/interfaces/game.interface';

@Injectable()
export class GamesRepository {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  create(game: Game): Observable<Game & Document<any, any, any>> {
    return from(this.gameModel.create(game));
  }

  find(
    filter: Partial<$Game>,
    skip = 0,
    limit = 20,
  ): Observable<(Game & Document<any, any, any>)[]> {
    return from(
      this.gameModel.find(filter).skip(skip).limit(limit),
    ) as Observable<(Game & Document<any, any, any>)[]>;
  }

  update(filter: Partial<$Game>, update: Partial<Game>): void {
    from(this.gameModel.updateMany(filter, update)).subscribe();
  }

  delete(filter: Partial<$Game>): void {
    from(this.gameModel.deleteMany(filter)).subscribe();
  }

  toJSON(gameDocument: Game & Document<any, any, any>) {
    return gameDocument.toJSON() as $Game;
  }
}
