import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger API Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('School Admission Management API')
    .setDescription(
      'The API documentation for the School Admission Management System foundation',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api/docs`,
  );
}
bootstrap();
