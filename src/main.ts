import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet())
  // app.use(csurf())
  // app.setGlobalPrefix('api');
  app.enableCors({
    origin:'http://localhost:3000',
    credentials:true
  })
  const config = new DocumentBuilder()
    .setTitle('nest study')
    .setDescription('nest study before web project')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'jwt',
        name: 'jwt',
        description: 'jwt token',
        in: 'header',
      },
      'accessKey',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document);
  console.log(process.env.NODE_ENV);
  await app.listen(3000);
}
bootstrap();
