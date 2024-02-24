import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { env } from 'process';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { RoleService } from './role/role.service';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Automatically validate routes and transform (e.g. strings to dates)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Parse & attach cookies to requests
  app.use(cookieParser());

  // Secure HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
    }),
  );

  // Use compression
  app.use(compression());

  // Setup initial roles (user, admin) if they don't exist
  const prismaService = app.get(PrismaService);
  const roleService = new RoleService(prismaService);
  roleService.setupRoles();

  // Put all routes under /api since we're also serving a client on /
  app.setGlobalPrefix('api');

  app.use('/static', express.static(join(process.cwd(), 'static')));

  // If we're not in production
  if (env.ENVIRONMENT !== 'prod') {
    // Setup swagger docs
    const swaggerConfig = new DocumentBuilder()
      .setTitle('beating.games')
      .setDescription('Swagger documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
      // prettier operation ids when generating client for frontend
      operationIdFactory: (controllerKey, methodKey) =>
        methodKey.charAt(0).toUpperCase().concat(methodKey.slice(1)),
    });
    SwaggerModule.setup('swagger', app, swaggerDocument);

    // Enable cors
    app.enableCors({
      origin: env.CORS_DOMAINS.split(';'),
      credentials: true,
    });
  }

  await app.listen(env.PORT || 3117);
}
bootstrap();
