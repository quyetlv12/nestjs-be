// src/modules/users/users.controller.ts
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';


@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('view_user_list')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    data: User[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    return this.usersService.findAll(page, limit);
  }

  @Get('all-user-list')
  @Permissions('view_user_list')
  async allUserList() {
    return this.usersService.findAllUser();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create_user')
  async create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }

  @Get(":id")
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('update_user')
  async update(id: number, user: UpdateUserDto) {
    return this.usersService.update(+id, user);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('delete_user')
  async remove(id: number) {
    return this.usersService.remove(+id);
  }

  @Get('by-nickname/:nickName')
  async findByNickName(@Param('nickName') nickName: string) {
    return this.usersService.findByNickName(nickName);
  }

  @Patch('lock/:id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('update_user')
  async lockUser(@Param('id') id: string) {
    return this.usersService.lockUser(+id);
  }

  @Patch('unlock/:id')
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('update_user')
  async unlockUser(@Param('id') id: string) {
    return this.usersService.unlockUser(+id);
  }

}
