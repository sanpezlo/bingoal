import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Observable, from } from 'rxjs';

import { Token, TokenDocument } from '@root/auth/schemas/token.schema';
import { $Token } from '@root/auth/interfaces/auth.interface';

@Injectable()
export class TokensRepository {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  create(token: Token): Observable<Token & Document<any, any, any>> {
    return from(this.tokenModel.create(token));
  }

  find(
    filter: Partial<$Token>,
  ): Observable<(Token & Document<any, any, any>)[]> {
    return from(this.tokenModel.find(filter)) as Observable<
      (Token & Document<any, any, any>)[]
    >;
  }

  delete(filter: Partial<$Token>): void {
    from(this.tokenModel.deleteMany(filter)).subscribe();
  }

  toJSON(tokenDocument: Token & Document<any, any, any>): $Token {
    return tokenDocument.toJSON() as $Token;
  }
}
