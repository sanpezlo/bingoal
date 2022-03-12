import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import {
  $AccessPayload,
  $RefreshPayload,
} from '@root/auth/interfaces/auth.interface';
import { TokensRepository } from '@root/auth/tokens.repository';

export async function createAccessToken(
  configService: ConfigService,
  id: string,
): Promise<string> {
  const accessPayload: $AccessPayload = {
    sub: id,
  };
  return (
    'Bearer ' +
    (await sign(
      accessPayload,
      configService.get<string>('token.access.secret'),
      {
        expiresIn: configService.get<number>('token.access.expires_in'),
      },
    ))
  );
}

export async function createRefreshToken(
  configService: ConfigService,
  tokensRepository: TokensRepository,
  id: string,
): Promise<string> {
  const $token = tokensRepository.toJSON(
    await firstValueFrom(
      tokensRepository.create({
        user: id,
      }),
    ),
  );

  const refreshPayload: $RefreshPayload = {
    sub: id,
    jti: $token._id,
  };

  return await sign(
    refreshPayload,
    configService.get<string>('token.refresh.secret'),
    {
      expiresIn: configService.get<number>('token.refresh.expires_in'),
    },
  );
}
