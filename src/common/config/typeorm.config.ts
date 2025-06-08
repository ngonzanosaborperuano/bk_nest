import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => {
  const env = configService.get<string>("NODE_ENV");
  console.log("NODE_ENV:", env); // o usar Logger

  return {
    type: "postgres",
    host: configService.get<string>("DB_HOST"),
    port: configService.get<number>("DB_PORT") ?? 5433,
    username: configService.get<string>("DB_USER"),
    password: configService.get<string>("DB_PASS"),
    database: configService.get<string>("DB_NAME"),
    synchronize: env !== "production",
    autoLoadEntities: true,
  };
};
