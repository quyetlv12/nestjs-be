import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role]) ,TypeOrmModule.forFeature([Permission]) ],
  controllers: [RolesController],
  providers: [RolesService , PermissionsGuard],
})
export class RolesModule {}
