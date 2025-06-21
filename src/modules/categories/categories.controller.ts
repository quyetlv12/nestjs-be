import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';


@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('create_category')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get('slug/:slug')
  findSlug(@Param('slug') slug: string) {
    return this.categoriesService.findSlug(slug);
  }

  @Get(':id')
  @Permissions('view_category')
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('update_category')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('delete_category')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }

 
}
