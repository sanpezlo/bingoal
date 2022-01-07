import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  PurchasedCard,
  PurchasedCardSchema,
} from '@root/purchased-cards/schemas/purchased-card.schema';
import { PurchasedCardsRepository } from '@root/purchased-cards/purchased-cards.repository';
import { PurchasedCardsController } from '@root/purchased-cards/purchased-cards.controller';
import { PurchasedCardsService } from '@root/purchased-cards/purchased-cards.service';
import { GamesModule } from '@root/games/games.module';
import { UsersModule } from '@root/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PurchasedCard.name, schema: PurchasedCardSchema },
    ]),
    forwardRef(() => GamesModule),
    UsersModule,
  ],
  providers: [PurchasedCardsRepository, PurchasedCardsService],
  exports: [PurchasedCardsRepository],
  controllers: [PurchasedCardsController],
})
export class PurchasedCardsModule {}
