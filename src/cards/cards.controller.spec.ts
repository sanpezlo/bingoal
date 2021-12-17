import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/cards.dto';

describe('CardsController', () => {
  let cardsController: CardsController;
  let spyService: CardsService;

  beforeAll(async () => {
    const ApiServiceProvider: Provider = {
      provide: CardsService,
      useFactory: () => ({
        create: jest.fn(() => ({})),
        find: jest.fn(() => ({})),
        findOne: jest.fn(() => ({})),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [CardsService, ApiServiceProvider],
    }).compile();

    cardsController = module.get<CardsController>(CardsController);
    spyService = module.get<CardsService>(CardsService);
  });

  it('should be defined', () => {
    expect(cardsController).toBeDefined();
    expect(spyService).toBeDefined();
  });

  it('should be called create method', () => {
    const createCardDto = new CreateCardDto();
    cardsController.create(createCardDto);
    expect(spyService.create).toHaveBeenCalledWith(createCardDto);
  });

  it('should be called find method', () => {
    cardsController.find();
    expect(spyService.find).toHaveBeenCalled();
  });

  it('should be called findOne method', () => {
    const id = '';
    cardsController.findOne(id);
    expect(spyService.findOne).toHaveBeenCalledWith(id);
  });
});
