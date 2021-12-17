import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  //   ValidationArguments,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  Validate,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Card } from '@root/cards/schemas/card.schema';

@ValidatorConstraint({ name: 'customData', async: false })
export class CustomData implements ValidatorConstraintInterface {
  validate(data: number[]): boolean {
    const B = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const I = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    const N = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
    const G = [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
    const O = [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75];

    if (data[12] !== 0) return false;
    if (data.some((value, index, array) => !(array.indexOf(value) === index)))
      return false;
    if (!data.slice(0, 5).every((value) => B.includes(value))) return false;
    if (!data.slice(5, 10).every((value) => I.includes(value))) return false;
    if (
      ![...data.slice(10, 12), ...data.slice(13, 15)].every((value) =>
        N.includes(value),
      )
    )
      return false;
    if (!data.slice(15, 20).every((value) => G.includes(value))) return false;
    if (!data.slice(20, 25).every((value) => O.includes(value))) return false;
    return true;
  }

  defaultMessage() {
    return 'data must be an valid data';
  }
}

export class CreateCardDto implements Partial<Card> {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(25)
  @ArrayMaxSize(25)
  @Validate(CustomData)
  @IsOptional()
  @ApiProperty({
    required: false,
    example: [
      1, 2, 3, 4, 5, 16, 17, 18, 19, 20, 31, 32, 0, 33, 34, 46, 47, 48, 49, 50,
      61, 62, 63, 64, 65,
    ],
  })
  data?: number[];
}
