import { Controller, Version, Post, Request, Body } from '@nestjs/common';

import { AuthService } from '@root/auth/auth.service';
import { LoginDto, RefreshDto } from '@root/auth/dto/auth.dto';
import { Login } from '@root/app/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Version('1')
  @Login()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @Version('1')
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto.refresh);
  }
}
