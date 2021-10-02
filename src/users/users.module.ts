import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '@root/users/schemas/user.schema';
import { UsersRepository } from '@root/users/users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
