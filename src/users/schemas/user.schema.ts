import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { schemaOptions, timestamps } from '@root/app/config/database/schema';
import { Role } from '@root/users/interfaces/user.interface';
import { Game } from '@root/games/schemas/game.schema';

export type UserDocument = User & Document;

@Schema(schemaOptions)
export class User {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, type: [String], enum: Role, default: [] })
  roles?: Role[];

  @Prop({
    required: false,
    type: [SchemaTypes.ObjectId],
    ref: 'Game',
    default: [],
  })
  games?: Game[] | string[];

  @Prop({ required: false, type: Date })
  [timestamps.createdAt]?: Date;

  @Prop({ required: false, type: Date })
  [timestamps.updatedAt]?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
