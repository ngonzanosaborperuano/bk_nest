import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { CONFIG_KEYS } from "../common/config/config-keys";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>(CONFIG_KEYS.REDIS.HOST, "localhost"),
      port: this.configService.get<number>(CONFIG_KEYS.REDIS.PORT, 6379),
      password: this.configService.get<string>(CONFIG_KEYS.REDIS.PASSWORD) as
        | string
        | undefined,
    });

    this.client.on("connect", () => {
      this.logger.log("✅ Redis conectado correctamente");
    });

    this.client.on("error", (err) => {
      this.logger.error("❌ Error en Redis", err);
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async set<T>(key: string, value: T, ttlInSeconds: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlInSeconds) {
      await this.client.set(key, serialized, "EX", ttlInSeconds);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async delete(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const exists = await this.client.exists(key);
    return exists === 1;
  }
}
