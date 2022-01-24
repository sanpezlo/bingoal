import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@root/app/app.module';
import { global } from '@root/global';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  if (configService.get<string>('node.env') === 'development')
    app.enableCors({ origin: '*' });

  global(app);

  const config = new DocumentBuilder()
    .setTitle('Bingoal API')
    .setVersion('1.0.2')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('port'));
}
bootstrap();
