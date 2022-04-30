import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import * as Express from 'express';

import { AppModule } from './app.module';

const server = Express();
const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    cors: true,
  });

  app.setGlobalPrefix('api/v1');

  await app.listen(PORT, () => {
    console.log(`Server is listing up ${PORT} on ${new Date()}`);
  });
}
bootstrap();
