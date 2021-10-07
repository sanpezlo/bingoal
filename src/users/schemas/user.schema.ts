import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { schemaOptions, timestamps } from '@root/app/config/database/schema';
import { Roles } from '@root/users/roles/roles.enum';

export type UserDocument = User & Document;

@Schema(schemaOptions)
export class User {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: false, type: Date })
  email_verified_at?: Date;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, type: [String], enum: Roles, default: [] })
  roles?: Roles[];

  @Prop({ required: false, type: Date })
  [timestamps.createdAt]?: Date;

  @Prop({ required: false, type: Date })
  [timestamps.updatedAt]?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
