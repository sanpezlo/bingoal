import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@root/users/users.module';
import { AuthService } from '@root/auth/auth.service';
import { LocalStrategy } from '@root/auth/strategies/local.strategy';
import { JwtStrategy } from '@root/auth/strategies/jwt.strategy';
import { AuthController } from '@root/auth/auth.controller';
import { TokensRepository } from '@root/auth/tokens.repository';
import { Token, TokenSchema } from '@root/auth/schemas/token.schema';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('token.access.secret'),
        signOptions: {
          expiresIn: configService.get<number>('token.access.expires_in'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokensRepository, AuthService, LocalStrategy, JwtStrategy],
  exports: [TokensRepository, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
