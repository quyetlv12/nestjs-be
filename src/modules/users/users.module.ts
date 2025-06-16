import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Category } from '../categories/entities/category.entity';
import { Video } from '../videos/entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User , Category , Video])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
