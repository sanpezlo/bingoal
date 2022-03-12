import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { from, map, Observable, of, switchMap, tap, toArray } from 'rxjs';

import { CardsRepository } from '@root/cards/cards.repository';
import {
  CreateCardDto,
  FindCardsDto,
  FindOneCardDto,
} from '@root/cards/dto/cards.dto';
import { ICard } from '@root/cards/interfaces/card.interface';
import { GamesRepository } from '@root/games/games.repository';
import { $Game } from '@root/games/interfaces/game.interface';
import { Card } from '@root/cards/schemas/card.schema';

@Injectable()
export class CardsService {
  constructor(
    private cardsRepository: CardsRepository,
    @Inject(forwardRef(() => GamesRepository))
    private gamesRepository: GamesRepository,
  ) {}

  create(createCardDto: CreateCardDto): Observable<ICard> {
    return of(createCardDto).pipe(
      switchMap(() => {
        if (!createCardDto.data) return this.createData();
        return of(createCardDto.data);
      }),
      switchMap((data) =>
        this.cardsRepository
          .find({
            data: { $all: data },
          } as unknown as Partial<Card>)
          .pipe(
            switchMap(([cardDocument]) => {
              if (Boolean(cardDocument)) return of(cardDocument);
              return this.cardsRepository.create({ data: data }).pipe(
                tap((cardDocument) =>
                  this.gamesRepository.update(
                    { played: false, playing: false },
                    {
                      $push: { cards: cardDocument._id },
                    } as Partial<$Game>,
                  ),
                ),
              );
            }),
          ),
      ),
      map((cardDocument) => this.cardsRepository.toJSON(cardDocument)),
    );
  }

  find(findCardsDto: FindCardsDto): Observable<ICard[]> {
    return from(
      this.cardsRepository.find({}, findCardsDto.offset, findCardsDto.limit),
    ).pipe(
      switchMap((cardsDocument) => from(cardsDocument)),
      map((cardDocument) => this.cardsRepository.toJSON(cardDocument)),
      toArray(),
    );
  }

  findOne(findOneCardDto: FindOneCardDto): Observable<ICard> {
    return this.cardsRepository.find({ _id: findOneCardDto.id }).pipe(
      tap(([cardDocument]) => {
        if (!cardDocument) throw new NotFoundException();
      }),
      map(([cardDocument]) => this.cardsRepository.toJSON(cardDocument)),
    );
  }

  createData(): Observable<number[]> {
    const B = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const I = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    const N = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
    const G = [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
    const O = [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75];
    return from(new Array(25)).pipe(
      map((v, i) => {
        if (i < 5) return B.splice(Math.floor(Math.random() * B.length), 1)[0];
        if (i < 10) return I.splice(Math.floor(Math.random() * I.length), 1)[0];
        if (i < 15) {
          if (i === 12) return 0;
          return N.splice(Math.floor(Math.random() * N.length), 1)[0];
        }
        if (i < 20) return G.splice(Math.floor(Math.random() * G.length), 1)[0];
        return O.splice(Math.floor(Math.random() * O.length), 1)[0];
      }),
      toArray(),
      switchMap((data) =>
        this.cardsRepository
          .find({
            data: { $all: data } as unknown as number[],
          })
          .pipe(
            switchMap((cardsDocument) => {
              if (cardsDocument.length) return this.createData();
              return of(data);
            }),
          ),
      ),
    );
  }
}
