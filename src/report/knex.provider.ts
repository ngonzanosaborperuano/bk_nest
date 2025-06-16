import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import knex, { Knex } from "knex";
import { CONFIG_KEYS } from "../common/config/config-keys";

export const KNEX = "KNEX_CONNECTION";

export const KnexProvider: Provider = {
  provide: KNEX,
  useFactory: async (config: ConfigService): Promise<Knex> => {
    return knex({
      client: "pg",
      connection: {
        host: config.get<string>(CONFIG_KEYS.DB.HOST),
        user: config.get<string>(CONFIG_KEYS.DB.USER),
        password: config.get<string>(CONFIG_KEYS.DB.PASS),
        database: config.get<string>(CONFIG_KEYS.DB.NAME),
        port: config.get<number>(CONFIG_KEYS.DB.PORT),
      },
    });
  },
  inject: [ConfigService],
};
