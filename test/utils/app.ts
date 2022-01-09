import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { env, envValidation } from '@root/app/config/env/env';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer;

export const close = async () => {
  if (mongoMemoryServer) await mongoMemoryServer.stop();
};

export function imports() {
  return [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [env],
      validate: envValidation,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        mongoMemoryServer = await MongoMemoryServer.create({
          binary: { version: '4.4.11' },
        });
        const uri = mongoMemoryServer.getUri();
        return { uri };
      },
    }),
  ];
}
