import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoryService } from './categories.service';
import { Category } from './entities/category.entity';
import { User } from '../users/user.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Category , User])],
  controllers: [CategoriesController],
  providers: [CategoryService],
})
export class CategoriesModule {}
