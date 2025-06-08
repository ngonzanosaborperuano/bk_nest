import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import Sentry from "@sentry/node";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./filters/http-exception.filter";
import "./instrument";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    sendDefaultPii: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.use(helmet());
  app.use(cors());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

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
