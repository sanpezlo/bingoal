import { Version, Post, Body, Get, Param } from '@nestjs/common';

import { Controller } from '@root/app/decorators/controller.decorator';
import { PurchasedCardsService } from '@root/purchased-cards/purchased-cards.service';
import { Auth } from '@root/app/decorators/auth.decorator';
import { User } from '@root/app/decorators/user.decorator';
import { IUser } from '@root/users/interfaces/user.interface';
import {
  CreatePurchasedCardDto,
  FindOnePurchasedCardDto,
} from '@root/purchased-cards/dto/purchased-cards.dto';

@Controller('purchased-cards')
export class PurchasedCardsController {
  constructor(private purhcasedCardsService: PurchasedCardsService) {}

  @Version('1')
  @Auth()
  @Post()
  async create(
    @Body() createPurchasedCardDto: CreatePurchasedCardDto,
    @User() user?: IUser,
  ) {
    return this.purhcasedCardsService.create(createPurchasedCardDto, user);
  }

  @Version('1')
  @Auth()
  @Get()
  async find() {
    return this.purhcasedCardsService.find();
  }

  @Version('1')
  @Auth()
  @Get(':id')
  async findOne(@Param() findOnePurchasedCardDto: FindOnePurchasedCardDto) {
    return this.purhcasedCardsService.findOne(findOnePurchasedCardDto);
  }
}
