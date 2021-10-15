import { User } from '@root/users/schemas/user.schema';

import { timestamps } from '@root/app/config/database/schema';

export enum Role {
  'Verified' = 'Verified',
  'Admin' = 'Admin',
}

export class IUser implements Omit<User, 'password'> {
  _id: string;
  name: string;
  email: string;
  email_verified_at?: Date;
  roles?: Role[];
  [timestamps.createdAt]: Date;
  [timestamps.updatedAt]: Date;
}

export interface $User extends IUser {
  password: string;
}
