import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

import { Token, TokenDocument } from '@root/auth/schemas/token.schema';
import { $Token } from '@root/auth/interfaces/auth.interface';

@Injectable()
export class TokensRepository {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async create(token: Token): Promise<Token & Document<any, any, any>> {
    return await this.tokenModel.create(token);
  }

  async find(
    filter: Partial<$Token>,
  ): Promise<(Token & Document<any, any, any>)[]> {
    return await this.tokenModel.find(filter);
  }

  async delete(filter: Partial<$Token>): Promise<void> {
    await this.tokenModel.deleteMany(filter);
  }

  toJSON(tokenDocument: Token & Document<any, any, any>): $Token {
    return tokenDocument.toJSON() as $Token;
  }
}
