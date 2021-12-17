import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  PurchasedCard,
  PurchasedCardSchema,
} from '@root/purchased-cards/schemas/purchased-card.schema';
import { PurchasedCardsRepository } from '@root/purchased-cards/purchased-cards.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PurchasedCard.name, schema: PurchasedCardSchema },
    ]),
  ],
  providers: [PurchasedCardsRepository],
  exports: [PurchasedCardsRepository],
})
export class PurchasedCardsModule {}
