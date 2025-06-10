import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CacheTTL } from "../../common/decorators/cache-ttl.decorator";

import { CacheInterceptor } from "../../common/interceptors/cache.interceptor";
import { RecipeService } from "../services/recipe.service";

@ApiTags("Recetas")
@Controller("recipes")
export class CommonController {
  constructor(private readonly commonService: RecipeService) {}

  @Get("random")
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300)
  @ApiOperation({ summary: "Obtenga recetas aleatorias por etiqueta" })
  @ApiQuery({ name: "etiqueta", required: true, example: "chicken" })
  @ApiQuery({ name: "number", required: false, example: 1 })
  @ApiResponse({
    status: 200,
    description: "Lista de recetas aleatorias de Spoonacular",
  })
  @ApiResponse({ status: 500, description: "Internal server error" })
  async getRandomRecipes(
    @Query("etiqueta") tag: string,
    @Query("number") number?: number
  ) {
    return this.commonService.getRandomRecipe(tag, number);
  }

  @Get("/debug-sentry")
  getError() {
    throw new Error("Esta es una prueba de error con sentry");
  }
}
