import { ApiProperty } from '@nestjs/swagger';

import { User } from '@root/users/schemas/user.schema';
import { timestamps } from '@root/app/config/database/schema';
import { Game } from '@root/games/schemas/game.schema';

export enum Role {
  'Admin' = 'Admin',
}

export class IUser implements Omit<User, 'password'> {
  @ApiProperty({
    example: '60f75b5c5329cf19200416f5',
  })
  _id: string;

  @ApiProperty({
    example: 'example',
  })
  name: string;

  @ApiProperty({
    example: 'example@mail.com  ',
  })
  email: string;

  @ApiProperty({
    required: false,
    example: [],
  })
  roles?: Role[];

  @ApiProperty({
    required: false,
    example: [],
  })
  games?: Game[] | string[];

  @ApiProperty({
    example: new Date(),
  })
  [timestamps.createdAt]: Date;

  @ApiProperty({
    example: new Date(),
  })
  [timestamps.updatedAt]: Date;
}

export interface $User extends IUser {
  password: string;
}
