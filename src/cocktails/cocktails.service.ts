import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cocktail } from './cocktail.entity';
import { CocktailIngredient } from './cocktail-ingredient.entity';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { IngredientsService } from '../ingredients/ingredients.service';

@Injectable()
export class CocktailsService {
  constructor(
    @InjectRepository(Cocktail)
    private cocktailsRepository: Repository<Cocktail>,
    @InjectRepository(CocktailIngredient)
    private cocktailIngredientsRepository: Repository<CocktailIngredient>,
    private ingredientsService: IngredientsService,
  ) {}

  async create(createCocktailDto: CreateCocktailDto): Promise<Cocktail> {
    for (const ing of createCocktailDto.ingredients) {
      await this.ingredientsService.findOne(ing.ingredientId);
    }

    const cocktail = this.cocktailsRepository.create({
      name: createCocktailDto.name,
      category: createCocktailDto.category,
      instructions: createCocktailDto.instructions,
    });

    const savedCocktail = await this.cocktailsRepository.save(cocktail);

    const cocktailIngredients = createCocktailDto.ingredients.map((ing) =>
      this.cocktailIngredientsRepository.create({
        cocktailId: savedCocktail.id,
        ingredientId: ing.ingredientId,
        quantity: ing.quantity,
        unit: ing.unit,
      }),
    );

    await this.cocktailIngredientsRepository.save(cocktailIngredients);

    return this.findOne(savedCocktail.id);
  }

  async findAll(
    category?: string,
    ingredientId?: string,
    nonAlcoholic?: boolean,
    sortBy: string = 'name',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Cocktail[]> {
    const queryBuilder = this.cocktailsRepository
      .createQueryBuilder('cocktail')
      .leftJoinAndSelect('cocktail.cocktailIngredients', 'ci')
      .leftJoinAndSelect('ci.ingredient', 'ingredient');

    if (category) {
      queryBuilder.andWhere('cocktail.category = :category', { category });
    }

    if (ingredientId) {
      queryBuilder.andWhere('ci.ingredientId = :ingredientId', {
        ingredientId,
      });
    }

    if (nonAlcoholic) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('ci2.cocktailId')
          .from(CocktailIngredient, 'ci2')
          .leftJoin('ci2.ingredient', 'ing2')
          .where('ing2.isAlcohol = true')
          .getQuery();
        return `cocktail.id NOT IN ${subQuery}`;
      });
    }

    queryBuilder.orderBy(`cocktail.${sortBy}`, order);

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Cocktail> {
    const cocktail = await this.cocktailsRepository.findOne({
      where: { id },
      relations: ['cocktailIngredients', 'cocktailIngredients.ingredient'],
    });

    if (!cocktail) {
      throw new NotFoundException(`Cocktail with ID ${id} not found`);
    }

    return cocktail;
  }

  async update(
    id: string,
    updateCocktailDto: UpdateCocktailDto,
  ): Promise<Cocktail> {
    const cocktail = await this.findOne(id);

    if (updateCocktailDto.ingredients) {
      for (const ing of updateCocktailDto.ingredients) {
        await this.ingredientsService.findOne(ing.ingredientId);
      }

      await this.cocktailIngredientsRepository.delete({ cocktailId: id });

      const cocktailIngredients = updateCocktailDto.ingredients.map((ing) =>
        this.cocktailIngredientsRepository.create({
          cocktailId: id,
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit,
        }),
      );

      await this.cocktailIngredientsRepository.save(cocktailIngredients);
    }

    if (updateCocktailDto.name) cocktail.name = updateCocktailDto.name;
    if (updateCocktailDto.category)
      cocktail.category = updateCocktailDto.category;
    if (updateCocktailDto.instructions)
      cocktail.instructions = updateCocktailDto.instructions;

    await this.cocktailsRepository.save(cocktail);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const cocktail = await this.findOne(id);
    await this.cocktailsRepository.remove(cocktail);
  }
}
