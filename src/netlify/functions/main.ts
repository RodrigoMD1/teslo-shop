import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { ValidationPipe } from '@nestjs/common';
import ServerlessHttp = require('serverless-http');


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  // const logger = new Logger('Bootstrap');
  const globalPrefix = '.netlify/functions/main';

  app.setGlobalPrefix(globalPrefix);


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );


  const expressApp = app.getHttpAdapter().getInstance();
  await app.init();
  return ServerlessHttp(expressApp)

  //await app.listen(process.env.PORT);
  //logger.log(`app corriendo en el puerto ${process.env.PORT}`);

}

let server;
export const handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());

  const response = server(event, context, callback);

  console.log('SERVER RESPONSE', response);

  return response;

};




