import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { RedisService } from "../cache/redis.service";
import { CACHE_TTL_KEY } from "../decorators/cache-ttl.decorator";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);
  constructor(
    private readonly redisService: RedisService,
    private readonly reflector: Reflector
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const key = `${request.method}:${request.originalUrl}`;

    const ttl = this.reflector.get<number>(CACHE_TTL_KEY, context.getHandler());

    if (!ttl) {
      return next.handle(); // No TTL, no caching
    }

    const cached = await this.redisService.get<any>(key);
    if (cached) {
      this.logger.log(`[CACHE HIT - Interceptor] ${key}`);
      return of(cached);
    }

    return next.handle().pipe(
      tap(async (response) => {
        this.logger.log(`[CACHE SET - Interceptor] ${key} (TTL: ${ttl}s)`);
        await this.redisService.set(key, response, ttl);
      })
    );
  }
}
