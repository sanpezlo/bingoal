import { firstValueFrom } from 'rxjs';

import { GamesRepository } from '@root/games/games.repository';
import { Game } from '@root/games/schemas/game.schema';

export const _games: Game[] = [
  {
    cards: [],
  },
  {
    cards: [],
  },
];

export async function createGame(gamesRepository: GamesRepository, game: Game) {
  return gamesRepository.toJSON(
    await firstValueFrom(gamesRepository.create(game)),
  );
}
