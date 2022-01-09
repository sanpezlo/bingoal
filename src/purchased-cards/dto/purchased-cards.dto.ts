import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

export class FindOnePurchasedCardDto {
  @IsString()
  @MaxLength(24)
  @MinLength(24)
  id: string;
}
