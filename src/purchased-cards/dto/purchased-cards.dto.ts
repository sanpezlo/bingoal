import {
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePurchasedCardDto {
  @IsString()
  @MaxLength(24)
  @MinLength(24)
  @IsOptional()
  @ApiProperty({
    required: false,
    example: '61bce3ada7d2261845c72169',
  })
  card?: string;

  @IsString()
  @MaxLength(24)
  @MinLength(24)
  @IsOptional()
  @ApiProperty({
    required: false,
    example: '61c2621644e77d67b83d1ff0',
  })
  game?: string;
}

export class FindPurchasedCardsDto {
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

export class FindOnePurchasedCardDto {
  @IsString()
  @MaxLength(24)
  @MinLength(24)
  id: string;
}
