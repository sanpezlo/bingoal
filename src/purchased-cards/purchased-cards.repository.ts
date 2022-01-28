import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

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

  async create(
    purchasedCard: PurchasedCard,
  ): Promise<PurchasedCard & Document<any, any, any>> {
    return await this.purchasedCardModel.create(purchasedCard);
  }

  async find(
    filter: Partial<$PurchasedCard>,
    skip = 0,
    limit = 20,
  ): Promise<(PurchasedCard & Document<any, any, any>)[]> {
    return await this.purchasedCardModel.find(filter).skip(skip).limit(limit);
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

  toJSON(purchasedCardDocument: PurchasedCard & Document<any, any, any>) {
    return purchasedCardDocument.toJSON() as $PurchasedCard;
  }
}
