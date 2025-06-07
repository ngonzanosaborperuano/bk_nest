import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { CommonService } from "./common.service";

describe("CommonService", () => {
  let service: CommonService;

  beforeAll(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const configMap: { [key: string]: string } = {
          SPOONACULAR_API_KEY: "mock-api-key",
          DB_NAME: ":memory:",
        };
        return configMap[key];
      }),
    };

    const mockHttpService = {
      get: jest.fn().mockImplementation(() =>
        of({
          data: { recipes: [{ id: 1, title: "Mock Recipe" }] },
        })
      ),
    };

    const mockCacheManager = {
      get: jest.fn().mockResolvedValue(null), // simula que no hay cache
      set: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<CommonService>(CommonService);
  });

  it("should throw InternalServerErrorException when API call fails", async () => {
    const errorHttpService = {
      get: jest.fn(() => {
        throw new Error("API failed");
      }),
    };

    const moduleWithError = await Test.createTestingModule({
      providers: [
        CommonService,
        { provide: ConfigService, useValue: { get: () => "mock-api-key" } },
        { provide: HttpService, useValue: errorHttpService },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn() },
        },
      ],
    }).compile();

    const serviceWithError = moduleWithError.get<CommonService>(CommonService);

    await expect(
      serviceWithError.getRandomRecipe("dessert", 1)
    ).rejects.toThrow("Failed to fetch recipe");
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should fetch random recipe and set it in cache", async () => {
    const result = await service.getRandomRecipe("dessert", 1);
    expect(result).toEqual({ recipes: [{ id: 1, title: "Mock Recipe" }] });
  });
});
