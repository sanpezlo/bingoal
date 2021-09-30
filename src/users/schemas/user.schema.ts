import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Roles } from '@root/users/roles/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: false, type: Date })
  email_verified_at?: Date;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, type: [String], enum: Roles })
  roles?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
