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
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const joi_1 = __importDefault(require("joi"));
const common_module_1 = require("./common/common.module");
const database_config_1 = __importDefault(require("./common/config/database.config"));
const typeorm_config_1 = require("./common/config/typeorm.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // Configuración global del .env y validación
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env", // opcional, por defecto busca en la raíz
                load: [database_config_1.default],
                validationSchema: joi_1.default.object({
                    // RAPIDAPI_KEY: Joi.string().required(),
                    DB_HOST: joi_1.default.string().required(),
                    DB_PORT: joi_1.default.number().default(5433),
                    DB_USER: joi_1.default.string().required(),
                    DB_PASS: joi_1.default.string().required(),
                    DB_NAME: joi_1.default.string().required(),
                }),
            }),
            // Conexión a la base de datos
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: typeorm_config_1.typeOrmConfig,
            }),
            // Cache global
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                ttl: 300,
            }),
            // Módulo común
            common_module_1.CommonModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map