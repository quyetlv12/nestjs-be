import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { Token } from 'src/common/decorators/token.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtTokenService } from 'src/common/services/jwt.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoService } from './videos.service';
@UseInterceptors(ClassSerializerInterceptor)
@Controller('/api/videos')
export class VideosController {
  constructor(private readonly videoService: VideoService, private readonly jwtTokenService: JwtTokenService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'file', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        limits: { fileSize: 100 * 1024 * 1024 },
      }
    ),
  )
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo video mới (có upload thumbnail)' })
  @ApiResponse({ status: 201, description: 'Video đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @UploadedFiles() files: { file?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
    @Body() body: CreateVideoDto,
    @Token() token: string,
  ) {
    const tokenData = this.jwtTokenService.getTokenData(token);
    body.createdById = tokenData.userId;
    const file = files.file?.[0];
    const thumbnail = files.thumbnail?.[0];
    return this.videoService.create({ ...body, file, thumbnail });
  }
  @Get()
  findAll() {
    return this.videoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}











