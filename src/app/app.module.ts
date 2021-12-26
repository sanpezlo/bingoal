import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { env, envValidation } from '@root/app/config/env/env';
import { UsersModule } from '@root/users/users.module';
import { AuthModule } from '@root/auth/auth.module';
import { CardsModule } from '@root/cards/cards.module';
import { PurchasedCardsModule } from '@root/purchased-cards/purchased-cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [env],
      validate: envValidation,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CardsModule,
    PurchasedCardsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
