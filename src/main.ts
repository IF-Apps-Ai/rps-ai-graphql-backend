import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Mengaktifkan CORS
  app.enableCors();

  // Mengambil port dari environment variable atau menggunakan port 3000 sebagai default
  const port = process.env.APP_PORT || 3000;

  await app.listen(port, '0.0.0.0'); // Mendengarkan di host '0.0.0.0' agar bisa diakses dari luar
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
