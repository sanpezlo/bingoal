import { timestamps } from '@root/app/config/database/schema';
import { PurchasedCard } from '@root/purchased-cards/schemas/purchased-card.schema';

export interface $PurchasedCard extends PurchasedCard {
  _id: string;
  [timestamps.createdAt]: Date;
  [timestamps.updatedAt]: Date;
}
