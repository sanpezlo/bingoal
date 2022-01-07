import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Game, GameSchema } from '@root/games/schemas/game.schema';
import { GamesRepository } from '@root/games/games.repository';
import { GamesService } from '@root/games/games.service';
import { GamesGateway } from '@root/games/games.gateway';
import { GamesController } from '@root/games/games.controller';
import { CardsModule } from '@root/cards/cards.module';
import { AuthModule } from '@root/auth/auth.module';
import { PurchasedCardsModule } from '@root/purchased-cards/purchased-cards.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    forwardRef(() => CardsModule),
    AuthModule,
    forwardRef(() => PurchasedCardsModule),
  ],
  providers: [GamesRepository, GamesService, GamesGateway],
  exports: [GamesRepository],
  controllers: [GamesController],
})
export class GamesModule {}
