import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Software para cine')
    .setDescription('Documentación de las rutas mapeadas en todo el proyecto.')
    .setVersion('1.0')
    .addTag('Rutas')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
