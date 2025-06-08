import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CommonService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}
  private readonly logger = new Logger(CommonService.name);
  private readonly baseUrl = this.configService.get<string>("BASE_URL");

  private readonly headers = {
    "x-rapidapi-host": this.configService.get<string>("HEADER_SPOONACULAR"),
    "x-rapidapi-key": this.configService.get<string>("RAPIDAPI_KEY"),
  };

  async getRandomRecipe(tag: string, number: number = 1): Promise<any> {
    const cacheKey = `random_recipe:${tag}:${number}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.log(`Returning cached recipe for: ${tag}`);

      return cached;
    }

    try {
      const url = `${this.baseUrl}/random`;

      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.headers,
          params: {
            number,
            tags: tag,
          },
        })
      );

      await this.cacheManager.set(cacheKey, data, 60 * 5); // cache por 5 minutos
      return data;
    } catch (error) {
      this.logger.error("Error fetching recipe", error);
      throw new InternalServerErrorException("Failed to fetch recipe");
    }
  }
}
