import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { schemaOptions, timestamps } from '@root/app/config/database/schema';

export type CardDocument = Card & Document;

@Schema(schemaOptions)
export class Card {
  @Prop({ required: true, type: [Number] })
  data: number[];

  @Prop({ required: false, type: Date })
  [timestamps.createdAt]?: Date;

  @Prop({ required: false, type: Date })
  [timestamps.updatedAt]?: Date;
}

export const CardSchema = SchemaFactory.createForClass(Card);
