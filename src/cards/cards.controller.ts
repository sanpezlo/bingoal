import { Version, Body, Post, Get, Param } from '@nestjs/common';

import { Controller } from '@root/app/decorators/controller.decorator';
import { Auth } from '@root/app/decorators/auth.decorator';
import { CardsService } from '@root/cards/cards.service';
import { CreateCardDto } from '@root/cards/dto/cards.dto';

@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Version('1')
  @Auth()
  @Post()
  async create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Version('1')
  @Auth()
  @Get()
  async find() {
    return this.cardsService.find();
  }

  @Version('1')
  @Auth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cardsService.findOne(id);
  }
}
