import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { schemaOptions, timestamps } from '@root/app/config/database/schema';
import { User } from '@root/users/schemas/user.schema';

export type TokenDocument = Token & Document;

@Schema(schemaOptions)
export class Token {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  user: User | string;

  @Prop({ required: false, type: Date })
  [timestamps.createdAt]?: Date;

  @Prop({ required: false, type: Date })
  [timestamps.updatedAt]?: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
