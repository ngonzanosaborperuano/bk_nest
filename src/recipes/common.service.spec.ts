import { HttpService } from "@nestjs/axios";
import { InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { of, throwError } from "rxjs";
import { CONFIG_KEYS } from "../common/config/config-keys";
import { CommonService } from "./common.service";

describe("CommonService", () => {
  let service: CommonService;
  let httpService: HttpService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const mockValues = {
        [CONFIG_KEYS.API_EXTERNA.URL]: "https://mock.api",
        [CONFIG_KEYS.API_EXTERNA.HEADER]: "mock-host",
        [CONFIG_KEYS.API_EXTERNA.KEY]: "mock-key",
      };
      return mockValues[key] ?? null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CommonService>(CommonService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  // Si el parámetro number es mayor que 0, pero no entero
  it("debe redondear 'número' a entero si se pasa un flotante", async () => {
    const mockResponse = { recipes: ["mock recipe"] };

    mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

    const result = await service.getRandomRecipe("breakfast", 2.7 as any); // pasando float

    expect(result).toEqual(mockResponse);
    expect(httpService.get).toHaveBeenCalledWith(
      "https://mock.api/random",
      expect.objectContaining({
        params: {
          tags: "breakfast",
          number: 2.7, // si deseas puedes cambiarlo a Math.floor(number)
        },
      })
    );
  });

  // Si tag es una cadena vacía (debería funcionar igual)
  it("Debería funcionar cuando 'etiqueta' es una cadena vacía", async () => {
    const mockResponse = { recipes: ["mock recipe"] };
    mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

    const result = await service.getRandomRecipe("", 1);

    expect(result).toEqual(mockResponse);
    expect(httpService.get).toHaveBeenCalledWith(
      "https://mock.api/random",
      expect.objectContaining({
        params: {
          tags: "",
          number: 1,
        },
      })
    );
  });

  // Si number no se pasa (valor por defecto = 1)
  it("El valor predeterminado debe ser 1 si no se proporciona 'número'", async () => {
    const mockResponse = { recipes: ["mock recipe"] };
    mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

    const result = await service.getRandomRecipe("dinner");

    expect(result).toEqual(mockResponse);
    expect(httpService.get).toHaveBeenCalledWith(
      "https://mock.api/random",
      expect.objectContaining({
        params: {
          tags: "dinner",
          number: 1,
        },
      })
    );
  });

  it("Debería obtener datos de la API y devolverlos.", async () => {
    const mockResponse = { recipes: ["mock recipe"] };

    mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

    const result = await service.getRandomRecipe("dessert", 1);

    expect(result).toEqual(mockResponse);

    expect(httpService.get).toHaveBeenCalledWith(
      "https://mock.api/random",
      expect.objectContaining({
        headers: {
          "x-rapidapi-key": "mock-key",
          "x-rapidapi-host": "mock-host",
        },
        params: {
          tags: "dessert",
          number: 1,
        },
      })
    );
  });

  // Caso con múltiples tags (usando coma)
  it("Debe manejar múltiples etiquetas separadas por comas", async () => {
    const mockResponse = { recipes: ["mock recipe"] };
    mockHttpService.get.mockReturnValue(of({ data: mockResponse }));

    const result = await service.getRandomRecipe("vegan,gluten-free", 2);

    expect(result).toEqual(mockResponse);
    expect(httpService.get).toHaveBeenCalledWith(
      "https://mock.api/random",
      expect.objectContaining({
        params: {
          tags: "vegan,gluten-free",
          number: 2,
        },
      })
    );
  });

  // Si la API responde con null o sin data
  it("Debería generar un error si la API devuelve una respuesta nula", async () => {
    mockHttpService.get.mockReturnValue(of(null)); // simula API rota

    await expect(service.getRandomRecipe("lunch")).rejects.toThrow(
      InternalServerErrorException
    );
  });

  // Simulación de error HTTP con código
  it("Debería lanzar una excepción InternalServerErrorException en caso de error de API", async () => {
    mockHttpService.get.mockReturnValue(
      throwError(() => new Error("API failed"))
    );

    await expect(service.getRandomRecipe("vegan", 2)).rejects.toThrow(
      InternalServerErrorException
    );
  });

  it("Debería registrar y arrojar un error HTTP con el estado 500", async () => {
    const error = {
      response: { status: 500 },
      message: "Internal Server Error",
    };

    mockHttpService.get.mockReturnValue(throwError(() => error));

    await expect(service.getRandomRecipe("pasta")).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
