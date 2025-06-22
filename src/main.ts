import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { QueryFailedFilter } from './common/query-failed.filter';
import { writeFileSync } from 'fs';
import { Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug', 'error', 'warn', 'log'],
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new QueryFailedFilter());

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('VietSocial Backend API')
    .setDescription('API documentation for VietSocial Backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for references
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('orders', 'Order management')
    .addTag('videos', 'Video management')
    .addTag('talents', 'Talent management')
    .addTag('categories', 'Category management')
    .addTag('comments', 'Comment management')
    .addTag('roles', 'Role management')
    .addTag('permissions', 'Permission management')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  writeFileSync('./swagger.json', JSON.stringify(documentFactory()));

  app.getHttpAdapter().get('/swagger-json', (req, res: Response) => {
    res.type('application/json').send(documentFactory());
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();


export async function createNestApplication() {
  const app = await NestFactory.create(AppModule);
  return app;
}
