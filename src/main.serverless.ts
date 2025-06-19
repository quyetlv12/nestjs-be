import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { QueryFailedFilter } from './common/query-failed.filter';
import * as express from 'express';
const serverless = require('serverless-http');

const expressApp = express();
expressApp.get('/favicon.ico', (_, res) => {
  res.status(204).end(); // or use sendFile(path.join(__dirname, '../public/favicon.ico'))
});

expressApp.get('/favicon.png', (_, res) => {
  res.status(204).end(); // or use sendFile(path.join(__dirname, '../public/favicon.ico'))
});
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new (require('@nestjs/platform-express').ExpressAdapter)(expressApp),
    {
      logger: ['debug', 'error', 'warn', 'log'],
    },
  );

  app.useStaticAssets(join(__dirname, 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new QueryFailedFilter());

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.init(); // ✅ KHÔNG dùng .listen()
}
bootstrap();

export const handler = serverless(expressApp);
