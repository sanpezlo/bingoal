import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { schemaOptions, timestamps } from '@root/app/config/database/schema';
import { Card } from '@root/cards/schemas/card.schema';
import { PurchasedCard } from '@root/purchased-cards/schemas/purchased-card.schema';

export type GameDocument = Game & Document;

@Schema(schemaOptions)
export class Game {
  @Prop({ required: false, type: Boolean, default: false })
  played?: boolean;

  @Prop({ required: false, type: Boolean, default: false })
  playing?: boolean;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: 'Card',
  })
  cards: Card[] | string[];

  @Prop({
    required: false,
    type: [SchemaTypes.ObjectId],
    ref: 'PurchasedCard',
    default: [],
  })
  purchasedCards?: PurchasedCard[] | string[];

  @Prop({
    required: false,
    type: [Number],
    default: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
    ],
  })
  balls?: number[];

  @Prop({ required: false, type: [Number], default: [] })
  remainingBalls?: number[];

  @Prop({
    required: false,
    type: [SchemaTypes.ObjectId],
    ref: 'PurchasedCard',
    default: [],
  })
  winningCards?: PurchasedCard[] | string[];

  @Prop({ required: false, type: Date })
  [timestamps.createdAt]?: Date;

  @Prop({ required: false, type: Date })
  [timestamps.updatedAt]?: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
