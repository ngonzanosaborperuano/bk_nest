"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmPostgres = void 0;
const config_keys_1 = require("./config-keys");
const typeOrmPostgres = (configService) => {
    const env = configService.get(config_keys_1.CONFIG_KEYS.APP.NODE_ENV);
    return {
        type: "postgres",
        host: configService.get(config_keys_1.CONFIG_KEYS.DB.HOST),
        port: configService.get(config_keys_1.CONFIG_KEYS.DB.PORT) ?? 5433,
        username: configService.get(config_keys_1.CONFIG_KEYS.DB.USER),
        password: configService.get(config_keys_1.CONFIG_KEYS.DB.PASS),
        database: configService.get(config_keys_1.CONFIG_KEYS.DB.NAME),
        // synchronize: env !== "production",
        autoLoadEntities: true,
    };
};
exports.typeOrmPostgres = typeOrmPostgres;
//# sourceMappingURL=typeorm.config.js.map