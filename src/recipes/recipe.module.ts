// src/common/common.module.ts
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { SentryGlobalFilter } from "@sentry/nestjs/setup";
import { CommonController as RecipeController } from "./controllers/recipe.controller";
import { RecipeService } from "./services/recipe.service";

@Module({
  imports: [HttpModule],
  controllers: [RecipeController],
  providers: [
    RecipeService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
  exports: [RecipeService],
})
export class RecipeModule {}
