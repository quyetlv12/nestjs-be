// src/modules/users/users.controller.ts
import { Permissions } from '@/common/decorators/permissions.decorator';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { UsersService } from './users.service';

@UseGuards(AuthGuard('jwt') , PermissionsGuard)
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('view_user')
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  @Permissions('create_user')
  async create(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user);
  }

  @Get()
  @Permissions('create_user')
  async findOne(id : number) {
    return this.usersService.findOne(+id);
  }

  @Put()
  @Permissions('update_user')
  async update(id : number, user : Partial<User>) {
    return this.usersService.update(+id, user);
  }

  @Delete()
  @Permissions('delete_user')
  async remove(id : number) {
    return this.usersService.remove(+id);
  }
}