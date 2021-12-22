import { GamesRepository } from '@root/games/games.repository';
import { Game } from '@root/games/schemas/game.schema';

export const _games: Game[] = [
  {
    cards: [],
  },
];

export async function createCards(
  gamesRepository: GamesRepository,
  game: Game,
) {
  return await gamesRepository.create(game);
}
