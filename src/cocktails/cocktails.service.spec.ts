import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CocktailsService } from './cocktails.service';
import { Cocktail } from './cocktail.entity';
import { CocktailIngredient } from './cocktail-ingredient.entity';
import { IngredientsService } from '../ingredients/ingredients.service';
import { NotFoundException } from '@nestjs/common';

describe('CocktailsService', () => {
  let service: CocktailsService;
  let cocktailRepository: Repository<Cocktail>;
  let cocktailIngredientRepository: Repository<CocktailIngredient>;
  let ingredientsService: IngredientsService;

  const mockCocktailRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    remove: jest.fn(),
  };

  const mockCocktailIngredientRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockIngredientsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CocktailsService,
        {
          provide: getRepositoryToken(Cocktail),
          useValue: mockCocktailRepository,
        },
        {
          provide: getRepositoryToken(CocktailIngredient),
          useValue: mockCocktailIngredientRepository,
        },
        {
          provide: IngredientsService,
          useValue: mockIngredientsService,
        },
      ],
    }).compile();

    service = module.get<CocktailsService>(CocktailsService);
    cocktailRepository = module.get<Repository<Cocktail>>(
      getRepositoryToken(Cocktail),
    );
    cocktailIngredientRepository = module.get<Repository<CocktailIngredient>>(
      getRepositoryToken(CocktailIngredient),
    );
    ingredientsService = module.get<IngredientsService>(IngredientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new cocktail with ingredients', async () => {
      const createDto = {
        name: 'Mojito',
        category: 'Cocktail',
        instructions: 'Mix ingredients',
        ingredients: [
          { ingredientId: 'ing-1', quantity: 50, unit: 'ml' },
        ],
      };

      const savedCocktail = {
        id: 'cocktail-1',
        name: 'Mojito',
        category: 'Cocktail',
        instructions: 'Mix ingredients',
      };

      const ingredient = { id: 'ing-1', name: 'Rum' };

      mockIngredientsService.findOne.mockResolvedValue(ingredient);
      mockCocktailRepository.create.mockReturnValue(savedCocktail);
      mockCocktailRepository.save.mockResolvedValue(savedCocktail);
      mockCocktailIngredientRepository.create.mockImplementation((data) => data);
      mockCocktailIngredientRepository.save.mockResolvedValue([]);
      mockCocktailRepository.findOne.mockResolvedValue({
        ...savedCocktail,
        cocktailIngredients: [],
      });

      const result = await service.create(createDto);

      expect(mockIngredientsService.findOne).toHaveBeenCalledWith('ing-1');
      expect(mockCocktailRepository.create).toHaveBeenCalled();
      expect(mockCocktailRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a cocktail by id', async () => {
      const cocktail = {
        id: '1',
        name: 'Mojito',
        category: 'Cocktail',
        instructions: 'Mix',
        cocktailIngredients: [],
      };

      mockCocktailRepository.findOne.mockResolvedValue(cocktail);

      const result = await service.findOne('1');

      expect(result).toEqual(cocktail);
    });

    it('should throw NotFoundException if cocktail not found', async () => {
      mockCocktailRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a cocktail', async () => {
      const cocktail = {
        id: '1',
        name: 'Mojito',
        cocktailIngredients: [],
      };

      mockCocktailRepository.findOne.mockResolvedValue(cocktail);
      mockCocktailRepository.remove.mockResolvedValue(cocktail);

      await service.remove('1');

      expect(mockCocktailRepository.remove).toHaveBeenCalledWith(cocktail);
    });
  });
});
