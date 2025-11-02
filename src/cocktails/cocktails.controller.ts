import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CocktailsService } from './cocktails.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';

@ApiTags('cocktails')
@Controller('cocktails')
export class CocktailsController {
  constructor(private readonly cocktailsService: CocktailsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cocktail' })
  create(@Body() createCocktailDto: CreateCocktailDto) {
    return this.cocktailsService.create(createCocktailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cocktails' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'ingredientId', required: false })
  @ApiQuery({ name: 'nonAlcoholic', required: false, type: Boolean })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'category', 'createdAt'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  findAll(
    @Query('category') category?: string,
    @Query('ingredientId') ingredientId?: string,
    @Query('nonAlcoholic') nonAlcoholic?: string,
    @Query('sortBy') sortBy: string = 'name',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    const nonAlcoholicBool = nonAlcoholic === 'true';
    return this.cocktailsService.findAll(
      category,
      ingredientId,
      nonAlcoholicBool,
      sortBy,
      order,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cocktail by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cocktailsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update cocktail' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCocktailDto: UpdateCocktailDto,
  ) {
    return this.cocktailsService.update(id, updateCocktailDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete cocktail' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cocktailsService.remove(id);
  }
}
