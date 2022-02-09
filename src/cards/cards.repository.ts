import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Observable, from } from 'rxjs';

import { Card, CardDocument } from '@root/cards/schemas/card.schema';
import { $Card } from '@root/cards/interfaces/card.interface';

@Injectable()
export class CardsRepository {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  async create(card: Card): Promise<Card & Document<any, any, any>> {
    return await this.cardModel.create(card);
  }

  async find(
    filter: Partial<$Card>,
    skip = 0,
    limit = 20,
  ): Promise<(Card & Document<any, any, any>)[]> {
    return await this.cardModel.find(filter).skip(skip).limit(limit);
  }

  rxFind(
    filter: Partial<$Card>,
    skip = 0,
    limit = 20,
  ): Observable<(Card & Document<any, any, any>)[]> {
    return from(
      this.cardModel.find(filter).skip(skip).limit(limit),
    ) as Observable<(Card & Document<any, any, any>)[]>;
  }

  toJSON(cardDocument: Card & Document<any, any, any>) {
    return cardDocument.toJSON() as $Card;
  }
}
