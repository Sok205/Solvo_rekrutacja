import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cocktail } from './cocktail.entity';
import { Ingredient } from '../ingredients/ingredient.entity';

@Entity('cocktail_ingredients')
export class CocktailIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cocktail_id' })
  cocktailId: string;

  @Column({ name: 'ingredient_id' })
  ingredientId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column()
  unit: string;

  @ManyToOne(() => Cocktail, (cocktail) => cocktail.cocktailIngredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cocktail_id' })
  cocktail: Cocktail;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.cocktailIngredients, {
    eager: true,
  })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;
}
