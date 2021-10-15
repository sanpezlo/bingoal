import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Token, TokenDocument } from '@root/auth/schemas/token.schema';
import { $Token } from '@root/auth/interfaces/auth.interface';

@Injectable()
export class TokensRepository {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async create(token: Token): Promise<$Token> {
    return (await this.tokenModel.create(token)).toJSON() as $Token;
  }

  async find(filter: Partial<$Token>): Promise<$Token[]> {
    return (await this.tokenModel.find(filter)).map((token) =>
      token.toJSON(),
    ) as $Token[];
  }

  async delete(filter: Partial<$Token>): Promise<void> {
    await this.tokenModel.deleteMany(filter);
  }
}
