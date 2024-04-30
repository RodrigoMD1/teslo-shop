import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap')

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );


  await app.listen(process.env.PORT);
  logger.log(`app corriendo en el puerto ${process.env.PORT}`);

}
bootstrap();
