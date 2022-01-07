import { Version, Post, Get, Param } from '@nestjs/common';
import { Auth } from '@root/app/decorators/auth.decorator';

import { Controller } from '@root/app/decorators/controller.decorator';
import { GamesService } from '@root/games/games.service';
import { CreateBallGameDto, FindOneGameDto } from '@root/games/dto/games.dto';
import { Role } from '@root/users/interfaces/user.interface';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Version('1')
  @Auth(Role.Admin)
  @Post()
  async create() {
    return this.gamesService.create();
  }

  @Version('1')
  @Auth()
  @Get()
  async find() {
    return this.gamesService.find();
  }

  @Version('1')
  @Auth()
  @Get(':id')
  async findOne(@Param() findOneGameDto: FindOneGameDto) {
    return this.gamesService.findOne(findOneGameDto);
  }

  @Version('1')
  @Auth(Role.Admin)
  @Post('ball/:id')
  createBall(@Param() createBallGameDto: CreateBallGameDto) {
    return this.gamesService.createBall(createBallGameDto);
  }
}
