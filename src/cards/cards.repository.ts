import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Card, CardDocument } from '@root/cards/schemas/card.schema';
import { $Card } from '@root/cards/interfaces/card.interface';

@Injectable()
export class CardsRepository {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  async create(card: Card): Promise<$Card> {
    return (await this.cardModel.create(card)).toJSON() as $Card;
  }

  async find(filter: Partial<$Card>): Promise<$Card[]> {
    return (await this.cardModel.find(filter)).map((card) =>
      card.toJSON(),
    ) as $Card[];
  }
}
