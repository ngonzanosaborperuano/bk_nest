import { Module } from "@nestjs/common"; //Decorador que marca esta clase como un módulo NestJS
import { ConfigModule, ConfigService } from "@nestjs/config"; //enviroment
import { TypeOrmModule } from "@nestjs/typeorm"; //ORM para manejar base de datos
import Joi from "joi"; //Librería para validar la forma y contenido de las variables de entorno

import apiExterna from "./common/config/api-externa.config";
import app from "./common/config/app.config";
import database from "./common/config/database.config";
import jwt from "./common/config/jwt.config";
import { typeOrmPostgres } from "./common/config/typeorm.config";

import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./common/cache/redis.module";
import { SentryModule } from "./common/monitoring/sentry.module";
import { RecipeModule } from "./recipe/recipe.module";

import { ReportsModule } from "./report/reports.module";
import { UsersModule } from "./user/user.module";

@Module({
  imports: [
    // Configuración global del .env y validación
    ConfigModule.forRoot({
      // Hace que la configuración esté disponible en toda la
      // aplicación sin volver a importar ConfigModule.
      isGlobal: true,
      // opcional, por defecto busca en la raíz
      envFilePath: ".env",
      // Carga una función que devuelve un objeto de configuración personalizado
      // (e.g. para organizar las variables).
      load: [database, apiExterna, app, jwt],
      // Usa Joi para validar que las variables de entorno existan y tengan el
      // formato correcto antes de arrancar la app.
      validationSchema: Joi.object({
        RAPIDAPI_KEY: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5433),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid("development", "production", "test", "provision")
          .default("development"),
        RAPIDAPI_BASE_URL: Joi.string().required(),
        HEADER_SPOONACULAR: Joi.string().required(),
        PORT: Joi.number().default(3000),
        SENTRY_DSN: Joi.string().required(),
        REDIS_HOST: Joi.string().default("localhost"),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().allow("", null),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES: Joi.string().required(),
      }),
    }),

    // Carga la configuración de TypeORM de forma asincrónica usando una función.
    TypeOrmModule.forRootAsync({
      // Asegura que ConfigService esté disponible.
      imports: [ConfigModule],
      // Indica que se inyectará ConfigService como dependencia.
      inject: [ConfigService],
      // Es una función que recibe ConfigService y devuelve la configuración
      // de TypeORM (host, user, etc.).
      useFactory: typeOrmPostgres,
    }),

    // Módulo común
    // Este módulo contiene servicios reutilizables (pipes, DTOs comunes, validadores,
    // utilidades, etc.) que serán accesibles en toda la aplicación.
    RecipeModule,
    SentryModule,
    RedisModule,
    UsersModule,
    AuthModule,
    ReportsModule,
  ],
})
export class AppModule {}
