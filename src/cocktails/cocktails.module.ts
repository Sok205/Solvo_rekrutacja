import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CocktailsController } from './cocktails.controller';
import { CocktailsService } from './cocktails.service';
import { Cocktail } from './cocktail.entity';
import { CocktailIngredient } from './cocktail-ingredient.entity';
import { IngredientsModule } from '../ingredients/ingredients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cocktail, CocktailIngredient]),
    IngredientsModule,
  ],
  controllers: [CocktailsController],
  providers: [CocktailsService],
})
export class CocktailsModule {}
