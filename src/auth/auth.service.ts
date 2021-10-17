import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';

import {
  IAuth,
  $RefreshPayload,
  $AccessPayload,
} from '@root/auth/interfaces/auth.interface';
import { TokensRepository } from '@root/auth/tokens.repository';
import { UsersRepository } from '@root/users/users.repository';
import { IUser, $User } from '@root/users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private tokensRepository: TokensRepository,
    private userRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async login(user: IUser): Promise<IAuth> {
    const accessPayload: $AccessPayload = {
      sub: user._id,
    };
    const accessToken = this.createAccessToken(accessPayload);

    const token = await this.tokensRepository.create({
      user: accessPayload.sub,
    });
    const refreshPayload: $RefreshPayload = {
      sub: accessPayload.sub,
      jti: token._id,
    };
    const refreshToken = this.createRefreshToken(refreshPayload);

    return {
      token_type: 'Bearer',
      access_token: accessToken,
      expires_in: this.configService.get<number>('token.access.expires_in'),
      refresh_token: refreshToken,
      refresh_token_expires_in: this.configService.get<number>(
        'token.refresh.expires_in',
      ),
    };
  }

  async refresh(refreshToken: string): Promise<IAuth> {
    try {
      const refreshPayload = this.jwtService.verify<$RefreshPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('token.access.secret'),
          ignoreExpiration: false,
        },
      );
      const [token] = await this.tokensRepository.find({
        _id: refreshPayload.jti,
        user: refreshPayload.sub,
      });
      if (!token) throw new UnauthorizedException();

      const newRefreshPayload: $RefreshPayload = {
        sub: refreshPayload.sub,
        jti: refreshPayload.jti,
      };
      const accessPayload: $AccessPayload = { sub: refreshPayload.sub };

      const accessToken = this.createAccessToken(accessPayload);
      const newRefreshToken = this.createRefreshToken(newRefreshPayload);

      return {
        token_type: 'Bearer',
        access_token: accessToken,
        expires_in: this.configService.get<number>('token.access.expires_in'),
        refresh_token: newRefreshToken,
        refresh_token_expires_in: this.configService.get<number>(
          'token.refresh.expires_in',
        ),
      };
    } catch (error) {
      throw new BadRequestException(['refresh must be a valid jwt string']);
    }
  }

  async validateLocal(email: string, password: string): Promise<IUser> {
    const [user] = await this.userRepository.find({ email });
    if (user && (await this.validatePassword(user, password)))
      return this.userRepository.format(user);
    return null;
  }

  async validateJwt(sub: string): Promise<IUser> {
    const [user] = await this.userRepository.find({ _id: sub });
    if (user) return this.userRepository.format(user);
    return null;
  }

  async validatePassword(user: $User, password: string): Promise<boolean> {
    return await compare(password, user.password);
  }

  async hash(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  createAccessToken(accessPayload: $AccessPayload): string {
    return this.jwtService.sign(accessPayload);
  }

  createRefreshToken(refreshPayload: $RefreshPayload): string {
    return this.jwtService.sign(refreshPayload, {
      secret: this.configService.get<string>('token.refresh.secret'),
      expiresIn: this.configService.get<number>('token.refresh.expires_in'),
    });
  }
}
