import { IsString, MaxLength, MinLength } from 'class-validator';

export class FindOneGameDto {
  @IsString()
  @MaxLength(24)
  @MinLength(24)
  id: string;
}
