import { INestApplication, ValidationPipe } from '@nestjs/common';

export function global(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.enableVersioning();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
}
