import { createNestApplication } from './main';
import serverlessExpress from '@vendia/serverless-express';

let cachedHandler: any;

async function bootstrap() {
  const app = await createNestApplication(); // tách phần khởi tạo app NestJS
  await app.init();
  return serverlessExpress({ app: app.getHttpAdapter().getInstance() });
}

export const handler = async (event, context) => {
  if (!cachedHandler) {
    cachedHandler = await bootstrap();
  }
  return cachedHandler(event, context);
};
