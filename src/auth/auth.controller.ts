import { Version, Post, Body, Put } from '@nestjs/common';

import { Controller } from '@root/app/decorators/controller.decorator';
import { AuthService } from '@root/auth/auth.service';
import {
  LoginDto,
  RefreshDto,
  UpdatePasswordDto,
} from '@root/auth/dto/auth.dto';
import { Auth, Login } from '@root/app/decorators/auth.decorator';
import { User } from '@root/app/decorators/user.decorator';
import { IUser } from '@root/users/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Version('1')
  @Login()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @User() user?: IUser) {
    return this.authService.login(user);
  }

  @Version('1')
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }

  @Version('1')
  @Auth()
  @Put('password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @User() user?: IUser,
  ) {
    return this.authService.updatePassword(user, updatePasswordDto);
  }
}
