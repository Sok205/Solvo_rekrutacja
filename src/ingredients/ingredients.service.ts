import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientsRepository: Repository<Ingredient>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    const existing = await this.ingredientsRepository.findOne({
      where: { name: createIngredientDto.name },
    });

    if (existing) {
      throw new ConflictException('Ingredient with this name already exists');
    }

    const ingredient = this.ingredientsRepository.create(createIngredientDto);
    return this.ingredientsRepository.save(ingredient);
  }

  async findAll(
    isAlcohol?: boolean,
    sortBy: string = 'name',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Ingredient[]> {
    const queryBuilder =
      this.ingredientsRepository.createQueryBuilder('ingredient');

    if (isAlcohol !== undefined) {
      queryBuilder.where('ingredient.isAlcohol = :isAlcohol', { isAlcohol });
    }

    queryBuilder.orderBy(`ingredient.${sortBy}`, order);

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Ingredient> {
    const ingredient = await this.ingredientsRepository.findOne({
      where: { id },
    });

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }

    return ingredient;
  }

  async update(
    id: string,
    updateIngredientDto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    const ingredient = await this.findOne(id);

    if (
      updateIngredientDto.name &&
      updateIngredientDto.name !== ingredient.name
    ) {
      const existing = await this.ingredientsRepository.findOne({
        where: { name: updateIngredientDto.name },
      });
      if (existing) {
        throw new ConflictException('Ingredient with this name already exists');
      }
    }

    Object.assign(ingredient, updateIngredientDto);
    return this.ingredientsRepository.save(ingredient);
  }

  async remove(id: string): Promise<void> {
    const ingredient = await this.findOne(id);
    await this.ingredientsRepository.remove(ingredient);
  }
}
