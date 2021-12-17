import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Game, GameSchema } from '@root/games/schemas/game.schema';
import { GamesRepository } from '@root/games/games.repository';
import { GamesService } from '@root/games/games.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  providers: [GamesRepository, GamesService],
  exports: [GamesRepository],
})
export class GamesModule {}
