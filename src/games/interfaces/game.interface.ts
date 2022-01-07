import { ApiProperty } from '@nestjs/swagger';
import { timestamps } from '@root/app/config/database/schema';
import { Card } from '@root/cards/schemas/card.schema';
import { Game } from '@root/games/schemas/game.schema';
import { PurchasedCard } from '@root/purchased-cards/schemas/purchased-card.schema';

export interface $Game extends Required<Game> {
  _id: string;
  [timestamps.createdAt]: Date;
  [timestamps.updatedAt]: Date;
}

export class IGame implements $Game {
  @ApiProperty({
    example: '61c2621644e77d67b83d1ff0',
  })
  _id: string;

  @ApiProperty({
    example: false,
  })
  played: boolean;

  @ApiProperty({
    example: false,
  })
  playing: boolean;

  @ApiProperty({
    example: ['61bce3ada7d2261845c72169'],
  })
  cards: Card[] | string[];

  @ApiProperty({
    example: [],
  })
  purchasedCards: PurchasedCard[] | string[];

  @ApiProperty({
    example: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
      58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
    ],
  })
  balls: number[];

  @ApiProperty({
    example: [],
  })
  ballsPlayed: number[];

  @ApiProperty({
    example: [],
  })
  winningCards: PurchasedCard[] | string[];

  @ApiProperty({
    example: new Date(),
  })
  [timestamps.createdAt]: Date;

  @ApiProperty({
    example: new Date(),
  })
  [timestamps.updatedAt]: Date;
}
