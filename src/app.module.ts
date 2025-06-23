import { Module } from "@nestjs/common"; //Decorador que marca esta clase como un módulo NestJS
import { ConfigModule, ConfigService } from "@nestjs/config"; //enviroment
import { TypeOrmModule } from "@nestjs/typeorm"; //ORM para manejar base de datos
import Joi from "joi"; //Librería para validar la forma y contenido de las variables de entorno

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import apiExterna from "./common/config/api-externa.config";
import app from "./common/config/app.config";
import database from "./common/config/database.config";
import jwt from "./common/config/jwt.config";
import redis from "./common/config/redis.conf";
import { typeOrmPostgres } from "./common/config/typeorm.config";

import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./common/cache/redis.module";
import { MetricsController } from "./common/monitoring/metrics.controller";
import { SentryModule } from "./common/monitoring/sentry.module";

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
      load: [database, apiExterna, app, jwt, redis,],
      validationSchema: Joi.object({
        // Base de datos
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),

        // Aplicación
        NODE_ENV: Joi.string()
          .valid("development", "production", "test", "provision")
          .default("development"),
        PORT: Joi.number().default(3000),

        // Redis
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required().allow("", null),

        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES: Joi.string().required(),

        // Sentry (Opcional, pero buena práctica si se usa)
        SENTRY_DSN: Joi.string().required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      // Asegura que ConfigService esté disponible.
      imports: [ConfigModule],
      // Indica que se inyectará ConfigService como dependencia.
      inject: [ConfigService],
      // Es una función que recibe ConfigService y devuelve la configuración
      // de TypeORM (host, user, etc.).
      useFactory: typeOrmPostgres,
    }),

    // Módulo para exponer métricas para Prometheus
    PrometheusModule.register({
      controller: MetricsController,
    }),
   
    SentryModule,
    RedisModule,
    UsersModule,
    AuthModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
