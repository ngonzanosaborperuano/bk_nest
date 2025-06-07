// import { HttpModule, HttpService } from '@nestjs/axios';
// import { CacheModule } from '@nestjs/cache-manager';
// import { ConfigModule } from '@nestjs/config';
// import { Test, TestingModule } from '@nestjs/testing';
// import { AxiosResponse } from 'axios';
// import { of } from 'rxjs';
// import { CommonService } from './common.service';

/**
En resumen
Tipo: Pruebas Unitarias

Qué prueban: El servicio CommonService, su creación y el método getRandomRecipe 
que consume una API externa (aunque idealmente en pruebas unitarias se debe simular 
o mockear la API externa).

Objetivo: Verificar que el servicio funciona correctamente de forma aislada.
 */

// describe('CommonService', () => {
//   let service: CommonService;
//   let httpService: HttpService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         ConfigModule.forRoot({ isGlobal: true }),
//         HttpModule,
//         CacheModule.register(),
//       ],
//       providers: [CommonService],
//     }).compile();

//     service = module.get<CommonService>(CommonService);
//     httpService = module.get<HttpService>(HttpService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should fetch random recipes successfully', async () => {
//     const mockedResponse: AxiosResponse = {
//       data: {
//         recipes: [
//           {
//             id: 1,
//             title: 'Mocked Dessert',
//             image: 'https://example.com/mock.jpg',
//             instructions: 'Mix and enjoy.',
//           },
//         ],
//       },
//       status: 200,
//       statusText: 'OK',
//       headers: {},
//       config: { headers: new (require('axios').AxiosHeaders)() },
//     };

//     jest.spyOn(httpService, 'get').mockReturnValueOnce(of(mockedResponse));

//     const result = await service.getRandomRecipe('dessert', 1);

//     expect(result).toBeDefined();
//     expect(result.recipes).toBeInstanceOf(Array);
//     expect(result.recipes.length).toBeGreaterThan(0);
//     expect(result.recipes[0].title).toEqual('Mocked Dessert');
//   });
// });

import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { of, throwError } from "rxjs";
import { CommonService } from "./common.service";

describe("CommonService", () => {
  let service: CommonService;
  let httpService: HttpService;
  let cacheManager: any;
  let configService: ConfigService;

  /*
Qué hace: 
- Crea un módulo de prueba aislado con dependencias mockeadas (simuladas).

- En lugar de hacer llamadas reales HTTP, al caché o al config real, se inyectan objetos 
  simulados que permiten controlar su comportamiento.

- Esto hace que las pruebas sean rápidas, confiables y sin efectos secundarios externos.
*/

  // 1. Setup inicial (beforeEach)
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
  // 2. Prueba de existencia
  // Verifica que el servicio se haya creado correctamente y esté definido.
  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // 3. Prueba que usa datos del caché si existen
  it("should return cached data if present", async () => {
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

  // 4. Prueba que llama a la API y guarda en caché si no hay datos previos
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
      "https://api.spoonacular.com/recipes/random",
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

  // 5. Prueba que lanza excepción si la llamada HTTP falla
  it("should throw InternalServerErrorException on HTTP error", async () => {
    cacheManager.get.mockResolvedValue(null);

    (httpService.get as jest.Mock).mockReturnValue(
      throwError(() => new Error("HTTP error"))
    );

    await expect(service.getRandomRecipe("dessert", 1)).rejects.toThrow(
      "Failed to fetch recipe"
    );
    expect(service["logger"].error).toHaveBeenCalled();
  });
});
