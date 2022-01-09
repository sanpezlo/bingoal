import { ApiProperty } from '@nestjs/swagger';

import { timestamps } from '@root/app/config/database/schema';
import { PurchasedCard } from '@root/purchased-cards/schemas/purchased-card.schema';
import { User } from '@root/users/schemas/user.schema';
import { Card } from '@root/cards/schemas/card.schema';
import { Game } from '@root/games/schemas/game.schema';

export interface $PurchasedCard extends Required<PurchasedCard> {
  _id: string;
  [timestamps.createdAt]: Date;
  [timestamps.updatedAt]: Date;
}

export class IPurchasedCard implements $PurchasedCard {
  @ApiProperty({
    example: '61c897bbf621a96fc7d15701',
  })
  _id: string;

  @ApiProperty({
    example: '60f75b5c5329cf19200416f5',
  })
  user: User | string;

  @ApiProperty({
    example: '61bce3ada7d2261845c72169',
  })
  card: Card | string;

  @ApiProperty({
    example: '61c2621644e77d67b83d1ff0',
  })
  game: Game | string;

  @ApiProperty({
    example: [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
  })
  score: boolean[];

  @ApiProperty({
    example: new Date(),
  })
  [timestamps.createdAt]: Date;

  @ApiProperty({
    example: new Date(),
  })
  [timestamps.updatedAt]: Date;
}
