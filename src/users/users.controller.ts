import { Version, Post, Body, Get, Param, Put } from '@nestjs/common';

import { Controller } from '@root/app/decorators/controller.decorator';
import { UsersService } from '@root/users/users.service';
import { Auth } from '@root/app/decorators/auth.decorator';
import { CreateUserDto, UpdateUserDto } from '@root/users/dto/users.dto';
import { User } from '@root/app/decorators/user.decorator';
import { IUser } from '@root/users/interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Version('1')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Version('1')
  @Auth()
  @Get()
  async find() {
    return this.usersService.find();
  }

  @Version('1')
  @Auth()
  @Get('me')
  profile(@User() user?: IUser) {
    return this.usersService.me(user);
  }

  @Version('1')
  @Auth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Version('1')
  @Auth()
  @Put()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user?: IUser) {
    return this.usersService.update(user, updateUserDto);
  }
}
