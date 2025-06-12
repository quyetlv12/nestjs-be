import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  @InjectRepository(Permission)
  private readonly permissionRepository: Repository<Permission>;

  
  create(createPermissionDto: CreatePermissionDto) {
    const permisson = this.permissionRepository.create(createPermissionDto);
    return permisson;
  }

  findAll() {
    const permisson = this.permissionRepository.find({});
    return permisson;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
