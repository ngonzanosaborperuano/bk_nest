import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CONFIG_KEYS } from "./config-keys";

export const typeOrmPostgres = (
  configService: ConfigService
): TypeOrmModuleOptions => {
  const env = configService.get<string>(CONFIG_KEYS.APP.NODE_ENV);

  return {
    type: "postgres",
    host: configService.get<string>(CONFIG_KEYS.DB.HOST),
    port: configService.get<number>(CONFIG_KEYS.DB.PORT) ?? 5433,
    username: configService.get<string>(CONFIG_KEYS.DB.USER),
    password: configService.get<string>(CONFIG_KEYS.DB.PASS),
    database: configService.get<string>(CONFIG_KEYS.DB.NAME),
    // synchronize: env !== "production",
    autoLoadEntities: true,
  };
};
