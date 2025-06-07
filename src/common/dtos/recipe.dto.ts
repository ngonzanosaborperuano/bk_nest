import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator';
import { IngredientDto } from './ingredient.dto';

export class RecipeDto {
  @ApiProperty() @IsInt() id?: number;
  @ApiProperty() @IsString() title?: string;
  @ApiProperty() @IsString() image?: string;
  @ApiProperty() @IsInt() readyInMinutes?: number;
  @ApiProperty() @IsInt() servings?: number;
  @ApiProperty() @IsBoolean() vegetarian?: boolean;
  @ApiProperty() @IsBoolean() vegan?: boolean;
  @ApiProperty() @IsBoolean() glutenFree?: boolean;

  @ApiProperty({ type: [IngredientDto] })
  @IsArray()
  @Type(() => IngredientDto)
  extendedIngredients?: IngredientDto[];

  @ApiProperty() @IsString() summary?: string;
  @ApiProperty() @IsString() instructions?: string;
}
