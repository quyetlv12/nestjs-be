import { Module } from '@nestjs/common';
import { TalentsService } from './talents.service';
import { TalentsController } from './talents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports : [TypeOrmModule.forFeature([User , Role , Category])],
  controllers: [TalentsController],
  providers: [TalentsService],
})
export class TalentsModule {}
