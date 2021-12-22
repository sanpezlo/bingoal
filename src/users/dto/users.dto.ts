import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '@root/users/schemas/user.schema';

export class CreateUserDto implements Omit<User, ''> {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'example',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'example@mail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'password',
  })
  password: string;
}

export class UpdateUserDto implements Partial<User> {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'example',
  })
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'example@mail.com',
  })
  email?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'password',
  })
  password: string;
}

export class FindOneUserDto {
  @IsString()
  @MaxLength(24)
  @MinLength(24)
  id: string;
}
