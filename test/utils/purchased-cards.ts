import { PurchasedCardsRepository } from '@root/purchased-cards/purchased-cards.repository';
import { PurchasedCard } from '@root/purchased-cards/schemas/purchased-card.schema';
import { GamesRepository } from '@root/games/games.repository';
import { Game } from '@root/games/schemas/game.schema';

export const _purchasedCards: PurchasedCard[] = [];

export async function createPurchasedCard(
  purchasedCardsRepository: PurchasedCardsRepository,
  gamesRepository: GamesRepository,
  purchasedCard: PurchasedCard,
) {
  const $purchasedCard = purchasedCardsRepository.toJSON(
    await purchasedCardsRepository.create(purchasedCard),
  );

  await gamesRepository.update({ _id: purchasedCard.game as string }, {
    $push: {
      purchasedCards: $purchasedCard._id,
    },
    $pull: {
      cards: purchasedCard.card,
    },
  } as Partial<Game>);

  return $purchasedCard;
}
