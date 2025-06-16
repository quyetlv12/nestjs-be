// src/modules/users/users.controller.ts
import { Permissions } from '@/common/decorators/permissions.decorator';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { UsersService } from './users.service';

@UseGuards(AuthGuard('jwt') , PermissionsGuard)
@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('view_user_list')
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<{ data: User[]; meta: { total: number; page: number; limit: number; totalPages: number; } }> {
    return this.usersService.findAll(page, limit);
  }

  @Get('all-user-list')
  @Permissions('view_user_list')
  async allUserList() {
    return this.usersService.findAllUser();
  }

  @Post()
  @Permissions('create_user')
  async create(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user);
  }

  @Get()
  @Permissions('view_detail_user')
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