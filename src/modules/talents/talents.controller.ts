import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Patch
} from '@nestjs/common';
import { UpdateTalentDto } from './dto/update-talent.dto';
import { TalentsService } from './talents.service';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('/api/talents')
export class TalentsController {
  constructor(private readonly talentsService: TalentsService) {}

  @Post()
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

  @Get('talent-by-business-id/:businessId')
  findTalentByBusinessId(@Param('businessId') businessId: string) {
    return this.talentsService.findTalentByBusinessId(+businessId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.talentsService.findOne(+id);
  }

  @Put(':id')
  @Permissions('update_talent')
  update(@Param('id') id: string, @Body() updateTalentDto: UpdateTalentDto) {
    return this.talentsService.update(+id, updateTalentDto);
  }

  @Delete(':id')
  @Permissions('delete_talent')
  remove(@Param('id') id: string) {
    return this.talentsService.remove(+id);
  }

  @Get('by-nickname/:nickName')
  findByNickName(@Param('nickName') nickName: string) {
    return this.talentsService.findByNickName(nickName);
  }

  @Put(':id/approve')
  @Permissions('update_talent')
  approveTalent(@Param('id') id: string) {
    return this.talentsService.approveTalent(+id);
  }
}
