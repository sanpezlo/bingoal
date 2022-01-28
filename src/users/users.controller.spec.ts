import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@root/users/users.controller';
import { UsersService } from '@root/users/users.service';
import {
  CreateUserDto,
  FindOneUserDto,
  FindUsersDto,
  UpdateUserDto,
} from '@root/users/dto/users.dto';
import { IUser } from '@root/users/interfaces/user.interface';

describe('UsersController', () => {
  let usersController: UsersController;
  let spyService: UsersService;

  beforeAll(async () => {
    const ApiServiceProvider: Provider = {
      provide: UsersService,
      useFactory: () => ({
        create: jest.fn(() => ({})),
        find: jest.fn(() => ({})),
        findOne: jest.fn(() => ({})),
        me: jest.fn(() => ({})),
        update: jest.fn(() => ({})),
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

  it('should be called find method', () => {
    const findUsersDto = new FindUsersDto();
    usersController.find(findUsersDto);
    expect(spyService.find).toHaveBeenCalledWith(findUsersDto);
  });

  it('should be called findOne method', () => {
    const findOneUserDto = new FindOneUserDto();
    usersController.findOne(findOneUserDto);
    expect(spyService.findOne).toHaveBeenCalledWith(findOneUserDto);
  });

  it('should be called profile method', () => {
    const user = new IUser();
    usersController.me(user);
    expect(spyService.me).toHaveBeenCalledWith(user);
  });

  it('should be called update method', () => {
    const updateUserDto = new UpdateUserDto();
    const user = new IUser();
    usersController.update(updateUserDto, user);
    expect(spyService.update).toHaveBeenCalledWith(updateUserDto, user);
  });
});
