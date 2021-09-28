import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import env from '@root/app/config/env';
import envValidation from '@root/app/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [env],
      validate: envValidation,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
