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
    required: false,
    type: [SchemaTypes.ObjectId],
    ref: 'Card',
    default: [],
  })
  cards: Card[] | string[];

  @Prop({
    required: false,
    type: [SchemaTypes.ObjectId],
    ref: 'PurchasedCard',
    default: [],
  })
  purchasedCards: PurchasedCard[] | string[];

  @Prop({ required: false, type: [Number], default: [] })
  balls: number[];

  @Prop({ required: false, type: [Number], default: [] })
  remainingBalls: number[];

  @Prop({
    required: false,
    type: [SchemaTypes.ObjectId],
    ref: 'PurchasedCard',
    default: [],
  })
  winningCards: PurchasedCard[] | string[];

  @Prop({ required: false, type: Date })
  [timestamps.createdAt]?: Date;

  @Prop({ required: false, type: Date })
  [timestamps.updatedAt]?: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
