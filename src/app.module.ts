import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import Joi from "joi";

import { CommonModule } from "./common/common.module";
import configuration from "./common/config/database.config";
import { typeOrmConfig } from "./common/config/typeorm.config";

@Module({
  imports: [
    // Configuración global del .env y validación
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env", // opcional, por defecto busca en la raíz
      load: [configuration],
      validationSchema: Joi.object({
        // RAPIDAPI_KEY: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5433),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),

    // Conexión a la base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),

    // Cache global
    CacheModule.register({
      isGlobal: true,
      ttl: 300,
    }),

    // Módulo común
    CommonModule,
  ],
})
export class AppModule {}
