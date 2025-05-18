import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const requiredEnvVars = ['JWT_SECRET', 'ENCRYPTION_KEY'];
  for (const envVar of requiredEnvVars) {
    const value = configService.get<string>(envVar);
    if (!value) {
      throw new Error(`Required environment variable ${envVar} is missing`);
    }
  }

  const config = new DocumentBuilder()
    .setTitle('API de Psicologia')
    .setDescription('API para gerenciamento de clientes, agendamentos, etc.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
