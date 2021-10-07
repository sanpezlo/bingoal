import { User } from '@root/users/schemas/user.schema';
import { Roles } from '@root/users/roles/roles.enum';

import { timestamps } from '@root/app/config/database/schema';

export class IUser implements Omit<User, 'password'> {
  _id: string;
  name: string;
  email: string;
  email_verified_at?: Date;
  roles?: Roles[];
  [timestamps.createdAt]: Date;
  [timestamps.updatedAt]: Date;
}

export interface $User extends IUser {
  password: string;
}
