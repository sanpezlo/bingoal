import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Card, CardSchema } from '@root/cards/schemas/card.schema';
import { GamesModule } from '@root/games/games.module';
import { CardsRepository } from '@root/cards/cards.repository';
import { CardsService } from '@root/cards/cards.service';
import { CardsController } from '@root/cards/cards.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    forwardRef(() => GamesModule),
  ],
  providers: [CardsRepository, CardsService],
  exports: [CardsRepository],
  controllers: [CardsController],
})
export class CardsModule {}
