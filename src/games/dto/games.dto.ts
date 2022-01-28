import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindGamesDto {
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

export class FindOneGameDto {
  @IsString()
  @MaxLength(24)
  @MinLength(24)
  id: string;
}

export class CreateBallGameDto {
  @IsString()
  @MaxLength(24)
  @MinLength(24)
  id: string;
}

export class JoinGameDto {
  @IsString()
  @MaxLength(24)
  @MinLength(24)
  game: string;
}
