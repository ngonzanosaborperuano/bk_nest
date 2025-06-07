import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name);
  private readonly baseUrl = 'https://api.spoonacular.com/recipes';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * Fetch random recipes from Spoonacular API with optional caching
   * @param tag The tag/category (e.g. 'dessert')
   * @param number Number of recipes
   * @returns Recipe data
   */
  async getRandomRecipe(tag: string, number: number = 1): Promise<any> {
    const cacheKey = `random_recipe:${tag}:${number}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.log(`Returning cached recipe for: ${tag}`);
      return cached;
    }

    try {
      const apiKey = this.configService.get<string>('SPOONACULAR_API_KEY');
      const url = `${this.baseUrl}/random`;

      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            number,
            tags: tag,
            apiKey,
          },
        }),
      );

      await this.cacheManager.set(cacheKey, data, 60 * 5); // cache por 5 minutos
      return data;
    } catch (error) {
      this.logger.error('Error fetching recipe', error);
      throw new InternalServerErrorException('Failed to fetch recipe');
    }
  }
}
