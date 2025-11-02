import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredientsService } from './ingredients.service';
import { Ingredient } from './ingredient.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('IngredientsService', () => {
  let service: IngredientsService;
  let repository: Repository<Ingredient>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientsService,
        {
          provide: getRepositoryToken(Ingredient),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IngredientsService>(IngredientsService);
    repository = module.get<Repository<Ingredient>>(
      getRepositoryToken(Ingredient),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new ingredient', async () => {
      const createDto = {
        name: 'Vodka',
        description: 'Clear spirit',
        isAlcohol: true,
      };
      const ingredient = { id: '1', ...createDto };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(ingredient);
      mockRepository.save.mockResolvedValue(ingredient);

      const result = await service.create(createDto);

      expect(result).toEqual(ingredient);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if ingredient name already exists', async () => {
      const createDto = {
        name: 'Vodka',
        description: 'Clear spirit',
        isAlcohol: true,
      };
      const existingIngredient = { id: '1', ...createDto };

      mockRepository.findOne.mockResolvedValue(existingIngredient);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return an ingredient by id', async () => {
      const ingredient = {
        id: '1',
        name: 'Vodka',
        description: 'Clear spirit',
        isAlcohol: true,
      };

      mockRepository.findOne.mockResolvedValue(ingredient);

      const result = await service.findOne('1');

      expect(result).toEqual(ingredient);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if ingredient not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all ingredients', async () => {
      const ingredients = [
        { id: '1', name: 'Vodka', isAlcohol: true },
        { id: '2', name: 'Orange Juice', isAlcohol: false },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(ingredients),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll();

      expect(result).toEqual(ingredients);
    });
  });

  describe('remove', () => {
    it('should remove an ingredient', async () => {
      const ingredient = {
        id: '1',
        name: 'Vodka',
        description: 'Clear spirit',
        isAlcohol: true,
      };

      mockRepository.findOne.mockResolvedValue(ingredient);
      mockRepository.remove.mockResolvedValue(ingredient);

      await service.remove('1');

      expect(mockRepository.remove).toHaveBeenCalledWith(ingredient);
    });
  });
});
