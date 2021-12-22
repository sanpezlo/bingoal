import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Game, GameSchema } from '@root/games/schemas/game.schema';
import { GamesRepository } from '@root/games/games.repository';
import { GamesService } from '@root/games/games.service';
import { GamesController } from '@root/games/games.controller';
import { CardsModule } from '@root/cards/cards.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    forwardRef(() => CardsModule),
  ],
  providers: [GamesRepository, GamesService],
  exports: [GamesRepository],
  controllers: [GamesController],
})
export class GamesModule {}
