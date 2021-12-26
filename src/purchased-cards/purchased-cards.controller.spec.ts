import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PurchasedCardsController } from '@root/purchased-cards/purchased-cards.controller';
import { PurchasedCardsService } from '@root/purchased-cards/purchased-cards.service';
import { IUser } from '@root/users/interfaces/user.interface';
import {
  CreatePurchasedCardDto,
  FindOnePurchasedCardDto,
} from '@root/purchased-cards/dto/purchased-cards.dto';

describe('PurchasedCardsController', () => {
  let purchasedCardsController: PurchasedCardsController;
  let spyService: PurchasedCardsService;

  beforeAll(async () => {
    const ApiServiceProvider: Provider = {
      provide: PurchasedCardsService,
      useFactory: () => ({
        create: jest.fn(() => ({})),
        find: jest.fn(() => ({})),
        findOne: jest.fn(() => ({})),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasedCardsController],
      providers: [PurchasedCardsService, ApiServiceProvider],
    }).compile();

    purchasedCardsController = module.get<PurchasedCardsController>(
      PurchasedCardsController,
    );
    spyService = module.get<PurchasedCardsService>(PurchasedCardsService);
  });

  it('should be defined', () => {
    expect(purchasedCardsController).toBeDefined();
    expect(spyService).toBeDefined();
  });

  it('should be called create method', () => {
    const createPurchasedCardDto = new CreatePurchasedCardDto();
    const user = new IUser();
    purchasedCardsController.create(createPurchasedCardDto, user);
    expect(spyService.create).toHaveBeenCalledWith(
      createPurchasedCardDto,
      user,
    );
  });

  it('should be called find method', () => {
    purchasedCardsController.find();
    expect(spyService.find).toHaveBeenCalled();
  });

  it('should be called findOne method', () => {
    const findOnePurchasedCardDto = new FindOnePurchasedCardDto();
    purchasedCardsController.findOne(findOnePurchasedCardDto);
    expect(spyService.findOne).toHaveBeenCalledWith(findOnePurchasedCardDto);
  });
});
