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
      throw new Error('Tên là bắt buộc và không được để trống');
    }

    // Validate thumbnail
    if (!createCategoryDto.thumbnail || typeof createCategoryDto.thumbnail !== 'string' || createCategoryDto.thumbnail.trim() === '') {
      throw new Error('Ảnh đại diện là bắt buộc và không được để trống');
    }

    // Validate slug
    if (!createCategoryDto.slug || typeof createCategoryDto.slug !== 'string' || createCategoryDto.slug.trim() === '') {
      throw new Error('Slug là bắt buộc và không được để trống');
    }

    // Validate parentId if present
    if (createCategoryDto.parentId !== undefined && createCategoryDto.parentId !== null) {
      if (typeof createCategoryDto.parentId !== 'number' || isNaN(createCategoryDto.parentId)) {
        throw new Error('parentId phải là một số');
      }
    }


    const existingCategory = await this.categoryRepository.findOneBy({ name: createCategoryDto.name });
    if (existingCategory) {
      throw new Error('Danh mục đã tồn tại');
    }

    const existingSlug = await this.categoryRepository.findOneBy({ slug: createCategoryDto.slug });
    if (existingSlug) {
      throw new Error('Slug đã tồn tại');
    }

    const category = this.categoryRepository.create(createCategoryDto);

    // Nếu có parentId thì tìm và gán parent
    if (createCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOneBy({ id: createCategoryDto.parentId });
      if (!parent) {
        throw new NotFoundException('Không tìm thấy danh mục cha');
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
      throw new NotFoundException(`Không tìm thấy danh mục với slug ${id}`);
    }

    return category;
  }



  async findSlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['parent', 'children' , 'users'],
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với slug ${slug}`);
    }

    return category;
  }

  async update(id: number, updateDto: UpdateCategoryDto): Promise<Category> {
    // Validate: name không được rỗng nếu truyền vào
    if ('name' in updateDto && (!updateDto.name || updateDto.name.trim() === '')) {
      throw new Error('Tên là bắt buộc');
    }

    // Validate: parentId nếu truyền vào phải là số nguyên dương hoặc null
    if ('parentId' in updateDto && updateDto.parentId !== null && updateDto.parentId !== undefined) {
      if (typeof updateDto.parentId !== 'number' || updateDto.parentId <= 0 || !Number.isInteger(updateDto.parentId)) {
        throw new Error('parentId phải là số nguyên dương hoặc null');
      }
    }

    const category = await this.findOne(id);

    if (updateDto.name) category.name = updateDto.name;
    if (updateDto.thumbnail) category.thumbnail = updateDto.thumbnail;
    if (updateDto.slug) {
      const existingSlug = await this.categoryRepository.findOneBy({ slug: updateDto.slug });
      if (existingSlug && existingSlug.id !== id) {
        throw new Error('Slug đã tồn tại');
      }
      category.slug = updateDto.slug;
    }
    if (updateDto.description !== undefined) category.description = updateDto.description;

    if (updateDto.parentId !== undefined) {
      if (updateDto.parentId === null) {
        category.parent = undefined;
      } else {
        const parent = await this.categoryRepository.findOneBy({ id: updateDto.parentId });
        if (!parent) throw new NotFoundException('Không tìm thấy danh mục cha');
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
