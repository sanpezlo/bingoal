import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

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

export class FindUsersDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 0,
  })
  offset?: number = 0;

  @Transform(({ value }) => {
    const newValue = parseInt(value);
    if (newValue >= 20) return 20;
    return newValue;
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 20,
  })
  limit?: number = 20;
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
