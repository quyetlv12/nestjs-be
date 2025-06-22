// api/index.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import serverlessExpress from '@vendia/serverless-express';
import { createNestApplication } from '../app.factory';

let cachedHandler: any;

async function bootstrap() {
  const app = await createNestApplication();

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

  const expressInstance = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressInstance });
}

export const handler = async (event, context) => {
  if (!cachedHandler) {
    cachedHandler = await bootstrap(); // init 1 lần
  }
  return cachedHandler(event, context);
};
