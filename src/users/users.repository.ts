import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '@root/users/schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<UserDocument> {
    return await this.userModel.create(user);
  }

  async find(filter: Partial<User>): Promise<UserDocument[]> {
    return await this.userModel.find(filter);
  }

  async update(filter: Partial<User>, update: Partial<User>): Promise<void> {
    await this.userModel.updateMany(filter, update);
  }

  async delete(filter: Partial<User>): Promise<void> {
    await this.userModel.deleteMany(filter);
  }
}
