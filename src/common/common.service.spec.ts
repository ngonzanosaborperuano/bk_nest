import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { of, throwError } from "rxjs";
import { CommonService } from "./common.service";

describe("CommonService", () => {
  let service: CommonService;
  let httpService: HttpService;
  let cacheManager: any;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue("fake-api-key"),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
        Logger,
      ],
    }).compile();

    service = module.get<CommonService>(CommonService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get(CACHE_MANAGER);
    configService = module.get<ConfigService>(ConfigService);

    jest.spyOn(service["logger"], "log").mockImplementation(() => {});
    jest.spyOn(service["logger"], "error").mockImplementation(() => {});
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return cached data if present and log the event", async () => {
    const cachedData = { recipes: ["cached recipe"] };
    cacheManager.get.mockResolvedValue(cachedData);

    const result = await service.getRandomRecipe("dessert", 1);

    expect(result).toEqual(cachedData);
    expect(cacheManager.get).toHaveBeenCalledWith("random_recipe:dessert:1");
    expect(httpService.get).not.toHaveBeenCalled();
    expect(service["logger"].log).toHaveBeenCalledWith(
      "Returning cached recipe for: dessert"
    );
  });

  it("should fetch data from API and cache it if no cached data", async () => {
    cacheManager.get.mockResolvedValue(null);

    const mockApiResponse = {
      data: { recipes: ["api recipe"] },
    };

    (httpService.get as jest.Mock).mockReturnValue(of(mockApiResponse));
    cacheManager.set.mockResolvedValue(undefined);

    const result = await service.getRandomRecipe("dessert", 1);

    expect(configService.get).toHaveBeenCalledWith("SPOONACULAR_API_KEY");
    expect(httpService.get).toHaveBeenCalledWith(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
      {
        params: {
          number: 1,
          tags: "dessert",
          apiKey: "fake-api-key",
        },
      }
    );

    expect(cacheManager.set).toHaveBeenCalledWith(
      "random_recipe:dessert:1",
      mockApiResponse.data,
      60 * 5
    );

    expect(result).toEqual(mockApiResponse.data);
  });

  it("should throw InternalServerErrorException on HTTP error and log the error", async () => {
    cacheManager.get.mockResolvedValue(null);

    (httpService.get as jest.Mock).mockReturnValue(
      throwError(() => new Error("HTTP error"))
    );

    await expect(service.getRandomRecipe("dessert", 1)).rejects.toThrow(
      InternalServerErrorException
    );
    expect(service["logger"].error).toHaveBeenCalledWith(
      "Error fetching recipe",
      expect.any(Error)
    );
  });

  // Nuevo: probar con diferentes valores de tag y number
  it("should handle different tags and numbers properly", async () => {
    cacheManager.get.mockResolvedValue(null);

    const mockApiResponse = {
      data: { recipes: ["api recipe with different tag and number"] },
    };

    (httpService.get as jest.Mock).mockReturnValue(of(mockApiResponse));
    cacheManager.set.mockResolvedValue(undefined);

    const tag = "vegan";
    const number = 3;
    const cacheKey = `random_recipe:${tag}:${number}`;

    const result = await service.getRandomRecipe(tag, number);

    expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
    expect(httpService.get).toHaveBeenCalledWith(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
      {
        params: {
          number,
          tags: tag,
          apiKey: "fake-api-key",
        },
      }
    );
    expect(cacheManager.set).toHaveBeenCalledWith(
      cacheKey,
      mockApiResponse.data,
      60 * 5
    );
    expect(result).toEqual(mockApiResponse.data);
  });

  // Nuevo: probar comportamiento con parámetros inválidos (vacíos o negativos)
  // Nota: El servicio no valida explícitamente, pero se puede probar que sigue llamando la API o retorna error si hay alguno.
  it("should handle empty tag by still calling API", async () => {
    cacheManager.get.mockResolvedValue(null);

    const mockApiResponse = {
      data: { recipes: ["api recipe with empty tag"] },
    };

    (httpService.get as jest.Mock).mockReturnValue(of(mockApiResponse));
    cacheManager.set.mockResolvedValue(undefined);

    const tag = "";
    const number = 1;
    const result = await service.getRandomRecipe(tag, number);

    expect(cacheManager.get).toHaveBeenCalledWith(`random_recipe::1`);
    expect(httpService.get).toHaveBeenCalledWith(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
      {
        params: {
          number,
          tags: tag,
          apiKey: "fake-api-key",
        },
      }
    );
    expect(result).toEqual(mockApiResponse.data);
  });

  it("should handle zero or negative number by calling API with that value", async () => {
    cacheManager.get.mockResolvedValue(null);

    const mockApiResponse = {
      data: { recipes: ["api recipe with zero or negative number"] },
    };

    (httpService.get as jest.Mock).mockReturnValue(of(mockApiResponse));
    cacheManager.set.mockResolvedValue(undefined);

    for (const number of [0, -5]) {
      const tag = "dessert";
      const cacheKey = `random_recipe:${tag}:${number}`;
      cacheManager.get.mockResolvedValue(null); // reset cache for each call
      const result = await service.getRandomRecipe(tag, number);

      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey);
      expect(httpService.get).toHaveBeenCalledWith(
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
        {
          params: {
            number,
            tags: tag,
            apiKey: "fake-api-key",
          },
        }
      );
      expect(result).toEqual(mockApiResponse.data);
    }
  });
});
