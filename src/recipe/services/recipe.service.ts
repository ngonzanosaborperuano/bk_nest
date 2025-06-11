import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { CONFIG_KEYS } from "../../common/config/config-keys";

@Injectable()
export class RecipeService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}
  private readonly baseUrl = this.configService.get<string>(
    CONFIG_KEYS.API_EXTERNA.URL
  );

  private readonly headers = {
    "x-rapidapi-host": this.configService.get<string>(
      CONFIG_KEYS.API_EXTERNA.HEADER
    ),
    "x-rapidapi-key": this.configService.get<string>(
      CONFIG_KEYS.API_EXTERNA.KEY
    ),
  };

  async getRandomRecipe(tag: string, number: number = 1): Promise<any> {
    const url = `${this.baseUrl}/random`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.headers,
          params: {
            number,
            tags: tag,
          },
        })
      );

      return data;
    } catch (error) {
      throw new InternalServerErrorException("Failed to fetch recipe");
    }
  }
}
