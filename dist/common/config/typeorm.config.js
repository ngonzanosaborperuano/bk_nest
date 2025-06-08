"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const typeOrmConfig = (configService) => {
    const env = configService.get("NODE_ENV");
    console.log("NODE_ENV:", env); // o usar Logger
    return {
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT") ?? 5433,
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASS"),
        database: configService.get("DB_NAME"),
        synchronize: env !== "production",
        autoLoadEntities: true,
    };
};
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map