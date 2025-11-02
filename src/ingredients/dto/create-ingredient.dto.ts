import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Vodka' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Clear distilled alcoholic beverage' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isAlcohol: boolean;

  @ApiProperty({ example: 'https://example.com/vodka.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
