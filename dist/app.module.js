"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common"); //Decorador que marca esta clase como un módulo NestJS
const config_1 = require("@nestjs/config"); //enviroment
const typeorm_1 = require("@nestjs/typeorm"); //ORM para manejar base de datos
const joi_1 = __importDefault(require("joi")); //Librería para validar la forma y contenido de las variables de entorno
const api_externa_config_1 = __importDefault(require("./common/config/api-externa.config"));
const app_config_1 = __importDefault(require("./common/config/app.config"));
const database_config_1 = __importDefault(require("./common/config/database.config"));
const typeorm_config_1 = require("./common/config/typeorm.config");
const cache_module_1 = require("./common/cache/cache.module");
const monitoring_module_1 = require("./common/monitoring/monitoring.module");
const recipe_module_1 = require("./recipes/recipe.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // Configuración global del .env y validación
            config_1.ConfigModule.forRoot({
                // Hace que la configuración esté disponible en toda la
                // aplicación sin volver a importar ConfigModule.
                isGlobal: true,
                // opcional, por defecto busca en la raíz
                envFilePath: ".env",
                // Carga una función que devuelve un objeto de configuración personalizado
                // (e.g. para organizar las variables).
                load: [database_config_1.default, api_externa_config_1.default, app_config_1.default],
                // Usa Joi para validar que las variables de entorno existan y tengan el
                // formato correcto antes de arrancar la app.
                validationSchema: joi_1.default.object({
                    RAPIDAPI_KEY: joi_1.default.string().required(),
                    DB_HOST: joi_1.default.string().required(),
                    DB_PORT: joi_1.default.number().default(5433),
                    DB_NAME: joi_1.default.string().required(),
                    DB_USER: joi_1.default.string().required(),
                    DB_PASS: joi_1.default.string().required(),
                    NODE_ENV: joi_1.default.string()
                        .valid("development", "production", "test", "provision")
                        .default("development"),
                    RAPIDAPI_BASE_URL: joi_1.default.string().required(),
                    HEADER_SPOONACULAR: joi_1.default.string().required(),
                    PORT: joi_1.default.number().default(3000),
                    SENTRY_DSN: joi_1.default.string().required(),
                    REDIS_HOST: joi_1.default.string().default("localhost"),
                    REDIS_PORT: joi_1.default.number().default(6379),
                    REDIS_PASSWORD: joi_1.default.string().allow("", null),
                }),
            }),
            // Carga la configuración de TypeORM de forma asincrónica usando una función.
            typeorm_1.TypeOrmModule.forRootAsync({
                // Asegura que ConfigService esté disponible.
                imports: [config_1.ConfigModule],
                // Indica que se inyectará ConfigService como dependencia.
                inject: [config_1.ConfigService],
                // Es una función que recibe ConfigService y devuelve la configuración
                // de TypeORM (host, user, etc.).
                useFactory: typeorm_config_1.typeOrmPostgres,
            }),
            // Módulo común
            // Este módulo contiene servicios reutilizables (pipes, DTOs comunes, validadores,
            // utilidades, etc.) que serán accesibles en toda la aplicación.
            recipe_module_1.RecipeModule,
            monitoring_module_1.MonitoringModule,
            cache_module_1.CacheModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map