import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CocktailIngredient } from './cocktail-ingredient.entity';

@Entity('cocktails')
export class Cocktail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('text')
  instructions: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CocktailIngredient, (ci) => ci.cocktail, {
    cascade: true,
    eager: true,
  })
  cocktailIngredients: CocktailIngredient[];
}
