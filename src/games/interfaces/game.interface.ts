import { timestamps } from '@root/app/config/database/schema';
import { Game } from '@root/games/schemas/game.schema';

export interface $Game extends Game {
  _id: string;
  [timestamps.createdAt]: Date;
  [timestamps.updatedAt]: Date;
}
