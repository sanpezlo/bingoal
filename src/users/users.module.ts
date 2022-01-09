import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@root/auth/auth.module';
import { User, UserSchema } from '@root/users/schemas/user.schema';
import { UsersRepository } from '@root/users/users.repository';
import { UsersController } from '@root/users/users.controller';
import { UsersService } from '@root/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersRepository, UsersService],
  exports: [UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
