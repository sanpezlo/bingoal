import { INestApplication, ValidationPipe } from '@nestjs/common';

import { SocketAuthIoAdapter } from '@root/app/adapters/socket-auth.adapter';

export function global(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useWebSocketAdapter(new SocketAuthIoAdapter(app));
}
