import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CocktailIngredientDto } from './cocktail-ingredient.dto';

export class CreateCocktailDto {
  @ApiProperty({ example: 'Mojito' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Cocktail' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: 'Muddle mint leaves with sugar and lime juice. Add rum and top with soda water.',
  })
  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ApiProperty({ type: [CocktailIngredientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CocktailIngredientDto)
  @ArrayMinSize(1)
  ingredients: CocktailIngredientDto[];
}
