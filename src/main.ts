import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap() {
  //crea la instancia de la aplicacion
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.use(helmet());
  app.use(cors()); //dominio
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

  //DOCUMENTACION
  const config = new DocumentBuilder()
    .setTitle("Spoonacular Recetas API")
    .setDescription("API para recetas aleatorias desde Spoonacular")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
