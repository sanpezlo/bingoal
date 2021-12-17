import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  PurchasedCard,
  PurchasedCardDocument,
} from '@root/purchased-cards/schemas/purchased-card.schema';
import { $PurchasedCard } from '@root/purchased-cards/interfaces/purchased-card.interface';

@Injectable()
export class PurchasedCardsRepository {
  constructor(
    @InjectModel(PurchasedCard.name)
    private purchasedCardModel: Model<PurchasedCardDocument>,
  ) {}

  async create(purchasedCard: PurchasedCard): Promise<$PurchasedCard> {
    return (
      await this.purchasedCardModel.create(purchasedCard)
    ).toJSON() as $PurchasedCard;
  }

  async find(filter: Partial<$PurchasedCard>): Promise<$PurchasedCard[]> {
    return (await this.purchasedCardModel.find(filter)).map((purchasedCard) =>
      purchasedCard.toJSON(),
    ) as $PurchasedCard[];
  }

  async update(
    filter: Partial<$PurchasedCard>,
    update: Partial<PurchasedCard>,
  ): Promise<void> {
    await this.purchasedCardModel.updateMany(filter, update);
  }

  async delete(filter: Partial<$PurchasedCard>): Promise<void> {
    await this.purchasedCardModel.deleteMany(filter);
  }
}
