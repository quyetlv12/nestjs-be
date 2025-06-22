// api/index.ts
import serverlessExpress from '@vendia/serverless-express';
import { createNestApplication } from '../src/app.factory';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

let cachedHandler: any;

async function bootstrap() {
  const app = await createNestApplication();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('VietSocial Backend API')
    .setDescription('API documentation for VietSocial Backend')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT-auth'
    )
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  writeFileSync('./swagger.json', JSON.stringify(document));

  return serverlessExpress({ app: app.getHttpAdapter().getInstance() });
}

export const handler = async (event, context) => {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  return cachedHandler(event, context);
};
