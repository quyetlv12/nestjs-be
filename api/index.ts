import { createNestApplication } from '../src/app.factory';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NextApiRequest, NextApiResponse } from 'next';
import { INestApplication } from '@nestjs/common';
import { RequestHandler } from 'express';

let cachedServer: RequestHandler;

async function bootstrap(): Promise<RequestHandler> {
  const app: INestApplication = await createNestApplication();

  const config = new DocumentBuilder()
    .setTitle('VietSocial Backend API')
    .setDescription('API docs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.init(); // 👈 QUAN TRỌNG: không gọi app.listen

  return app.getHttpAdapter().getInstance();
}

// ✅ Đây là export đúng cho Vercel (default export function nhận req, res)
export default async function handler(req: NextApiRequest, res: NextApiResponse , context: any) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res, context); // 👈 Vercel sẽ gọi function này
}
