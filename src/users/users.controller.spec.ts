import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@root/users/users.controller';
import { UsersService } from '@root/users/users.service';
import { CreateUserDto } from '@root/users/dto/users.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let spyService: UsersService;

  beforeAll(async () => {
    const ApiServiceProvider: Provider = {
      provide: UsersService,
      useFactory: () => ({
        create: jest.fn(() => ({})),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, ApiServiceProvider],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    spyService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(spyService).toBeDefined();
  });

  it('should be called create method', () => {
    const createUserDto = new CreateUserDto();
    usersController.create(createUserDto);
    expect(spyService.create).toHaveBeenCalledWith(createUserDto);
  });
});
