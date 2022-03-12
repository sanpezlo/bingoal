import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Observable, from } from 'rxjs';

import { User, UserDocument } from '@root/users/schemas/user.schema';
import { $User, IUser } from '@root/users/interfaces/user.interface';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(user: User): Observable<User & Document<any, any, any>> {
    return from(this.userModel.create(user));
  }

  find(
    filter: Partial<$User>,
    skip = 0,
    limit = 20,
  ): Observable<(User & Document<any, any, any>)[]> {
    return from(
      this.userModel.find(filter).skip(skip).limit(limit),
    ) as Observable<(User & Document<any, any, any>)[]>;
  }

  update(filter: Partial<$User>, update: Partial<User>): void {
    from(this.userModel.updateMany(filter, update)).subscribe();
  }

  delete(filter: Partial<$User>): void {
    from(this.userModel.deleteMany(filter)).subscribe();
  }

  toJSON(userDocument: User & Document<any, any, any>): $User {
    return userDocument.toJSON() as $User;
  }

  format(user: $User): IUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
