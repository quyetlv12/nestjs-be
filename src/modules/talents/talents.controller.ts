import { Permissions } from '@/common/decorators/permissions.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { UpdateTalentDto } from './dto/update-talent.dto';
import { TalentsService } from './talents.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';

@Controller('/api/talents')
export class TalentsController {
  constructor(private readonly talentsService: TalentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('create_talent')
  create(@Body() createTalentDto: any) {
   try {    
    return this.talentsService.create(createTalentDto);
   } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
   }
  }

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10 , @Query('categoryId') categoryId: string , @Query('price') price: string , @Query('name') name: string) {
    return this.talentsService.findAll(page, limit , categoryId , price , name);
  }

  @Get('/all')
  findAllTalent() {
    return this.talentsService.findAllTalent();
  }


  @Get('/top10')
  findTop10Talent() {
    return this.talentsService.findTop10Talent();
  }


  @Get('talent-by-business-id/:businessId')
  findTalentByBusinessId(@Param('businessId') businessId: string) {
    return this.talentsService.findTalentByBusinessId(+businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.talentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('update_talent')
  update(@Param('id') id: string, @Body() updateTalentDto: UpdateTalentDto) {
    return this.talentsService.update(+id, updateTalentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('delete_talent')
  remove(@Param('id') id: string) {
    return this.talentsService.remove(+id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.talentsService.findBySlug(slug);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('update_talent')
  approveTalent(@Param('id') id: string) {
    return this.talentsService.approveTalent(+id);
  }
}
