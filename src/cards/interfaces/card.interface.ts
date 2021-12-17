import { ApiProperty } from '@nestjs/swagger';

import { timestamps } from '@root/app/config/database/schema';
import { Card } from '@root/cards/schemas/card.schema';

export interface $Card extends Card {
  _id: string;
  [timestamps.createdAt]: Date;
  [timestamps.updatedAt]: Date;
}

export class ICard implements $Card {
  @ApiProperty({
    example: '61bce3ada7d2261845c72169',
  })
  _id: string;

  @ApiProperty({
    example: [
      1, 2, 3, 4, 5, 16, 17, 18, 19, 20, 31, 32, 0, 33, 34, 46, 47, 48, 49, 50,
      61, 62, 63, 64, 65,
    ],
  })
  data: number[];

  @ApiProperty({
    example: new Date(),
  })
  [timestamps.createdAt]: Date;

  @ApiProperty({
    example: new Date(),
  })
  [timestamps.updatedAt]: Date;
}
