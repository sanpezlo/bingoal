import { Version, Post, Get, Param, Query } from '@nestjs/common';
import { Auth } from '@root/app/decorators/auth.decorator';

import { Controller } from '@root/app/decorators/controller.decorator';
import { GamesService } from '@root/games/games.service';
import {
  CreateBallGameDto,
  FindGamesDto,
  FindOneGameDto,
} from '@root/games/dto/games.dto';
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
  async find(@Query() findGamesDto: FindGamesDto) {
    return this.gamesService.find(findGamesDto);
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
