import { Provider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '@root/auth/auth.controller';
import { AuthService } from '@root/auth/auth.service';
import { LoginDto, RefreshDto, UpdatePasswordDto } from './dto/auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let spyService: AuthService;

  beforeAll(async () => {
    const ApiServicePorvider: Provider = {
      provide: AuthService,
      useFactory: () => ({
        login: jest.fn(() => ({})),
        refresh: jest.fn(() => ({})),
        updatePassword: jest.fn(() => ({})),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, ApiServicePorvider],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    spyService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(spyService).toBeDefined();
  });

  it('should be called login method', () => {
    const loginDto = new LoginDto();
    authController.login(loginDto);
    expect(spyService.login).toHaveBeenCalled();
  });

  it('should be called refresh method', () => {
    const refreshDto = new RefreshDto();
    authController.refresh(refreshDto);
    expect(spyService.refresh).toHaveBeenCalledWith(refreshDto);
  });

  it('should be called updatePassword method', () => {
    const updatePasswordDto = new UpdatePasswordDto();
    authController.updatePassword(updatePasswordDto);
    expect(spyService.updatePassword).toHaveBeenCalledWith(
      undefined,
      updatePasswordDto,
    );
  });
});
