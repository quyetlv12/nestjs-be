import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {    
    // Validate name
    if (!createCategoryDto.name || typeof createCategoryDto.name !== 'string' || createCategoryDto.name.trim() === '') {
      throw new Error('Name is required and must be a non-empty string');
    }

    // Validate thumbnail
    if (!createCategoryDto.thumbnail || typeof createCategoryDto.thumbnail !== 'string' || createCategoryDto.thumbnail.trim() === '') {
      throw new Error('Thumbnail is required and must be a non-empty string');
    }

    // Validate slug
    if (!createCategoryDto.slug || typeof createCategoryDto.slug !== 'string' || createCategoryDto.slug.trim() === '') {
      throw new Error('Slug is required and must be a non-empty string');
    }

    // Validate parentId if present
    if (createCategoryDto.parentId !== undefined && createCategoryDto.parentId !== null) {
      if (typeof createCategoryDto.parentId !== 'number' || isNaN(createCategoryDto.parentId)) {
        throw new Error('parentId must be a number');
      }
    }


    const existingCategory = await this.categoryRepository.findOneBy({ name: createCategoryDto.name });
    if (existingCategory) {
      throw new Error('Category already exists');
    }

    const existingSlug = await this.categoryRepository.findOneBy({ slug: createCategoryDto.slug });
    if (existingSlug) {
      throw new Error('Slug already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);

    // Nếu có parentId thì tìm và gán parent
    if (createCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOneBy({ id: createCategoryDto.parentId });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
      category.parent = parent;
    }

    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['parent', 'children'],
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children' , 'users'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${id} not found`);
    }

    return category;
  }



  async findSlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['parent', 'children' , 'users'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async update(id: number, updateDto: UpdateCategoryDto): Promise<Category> {
    // Validate: name không được rỗng nếu truyền vào
    if ('name' in updateDto && (!updateDto.name || updateDto.name.trim() === '')) {
      throw new Error('Name is required');
    }

    // Validate: parentId nếu truyền vào phải là số nguyên dương hoặc null
    if ('parentId' in updateDto && updateDto.parentId !== null && updateDto.parentId !== undefined) {
      if (typeof updateDto.parentId !== 'number' || updateDto.parentId <= 0 || !Number.isInteger(updateDto.parentId)) {
        throw new Error('parentId must be a positive integer or null');
      }
    }

    const category = await this.findOne(id);

    if (updateDto.name) category.name = updateDto.name;
    if (updateDto.thumbnail) category.thumbnail = updateDto.thumbnail;
    if (updateDto.slug) {
      const existingSlug = await this.categoryRepository.findOneBy({ slug: updateDto.slug });
      if (existingSlug && existingSlug.id !== id) {
        throw new Error('Slug already exists');
      }
      category.slug = updateDto.slug;
    }
    if (updateDto.description !== undefined) category.description = updateDto.description;

    if (updateDto.parentId !== undefined) {
      if (updateDto.parentId === null) {
        category.parent = undefined;
      } else {
        const parent = await this.categoryRepository.findOneBy({ id: updateDto.parentId });
        if (!parent) throw new NotFoundException('Parent category not found');
        category.parent = parent;
      }
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
