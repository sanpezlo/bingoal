import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { schemaOptions, timestamps } from '@root/app/config/database/schema';
import { User } from '@root/users/schemas/user.schema';
import { Card } from '@root/cards/schemas/card.schema';

export type PurchasedCardDocument = PurchasedCard & Document;

@Schema(schemaOptions)
export class PurchasedCard {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  user: User | string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Card' })
  card: Card | string;

  @Prop({
    required: false,
    type: [Boolean],
    default: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
  })
  score: boolean[];

  @Prop({ required: false, type: Date })
  [timestamps.createdAt]?: Date;

  @Prop({ required: false, type: Date })
  [timestamps.updatedAt]?: Date;
}

export const PurchasedCardSchema = SchemaFactory.createForClass(PurchasedCard);
