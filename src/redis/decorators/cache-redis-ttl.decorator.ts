import { SetMetadata } from "@nestjs/common";

export const CACHE_REDIS_TTL_KEY = "cache_redis_ttl";

export const CacheRedisTTL = (ttl: number) =>
  SetMetadata(CACHE_REDIS_TTL_KEY, ttl);
