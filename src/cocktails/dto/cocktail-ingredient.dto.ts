import { IsString, IsNumber, IsUUID, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CocktailIngredientDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  ingredientId: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: 'ml' })
  @IsString()
  @IsNotEmpty()
  unit: string;
}
