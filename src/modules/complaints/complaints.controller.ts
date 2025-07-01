import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpCode,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { ResolveComplaintDto } from './dto/resolve-complaint.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ComplaintPriority, ComplaintStatus, ComplaintType } from './entities/complaint.entity';
import { Token } from 'src/common/decorators/token.decorator';
import { JwtTokenService } from 'src/common/services/jwt.service';

@Controller('api/complaints')
@UseGuards(JwtAuthGuard)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService, private readonly jwtTokenService: JwtTokenService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'evidence_file', maxCount: 5 }], {
      storage: memoryStorage(),
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() createComplaintDto: CreateComplaintDto,
    @Token() token: any,
    @UploadedFiles() files: { evidence_file?: Express.Multer.File[] },
  ) {
    const user = this.jwtTokenService.getTokenData(token);
    const evidences : any = files?.evidence_file ;

    return await this.complaintsService.create({...createComplaintDto , evidences_file : evidences}, user.userId);
  }

  @Get()
  async findAll(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('complaintType') complaintType?: string,
    @Query('userId') userId?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    const userIdNum = userId ? parseInt(userId) : undefined;

    // Validate enum values and convert to proper enum types
    const validStatus = status && Object.values(ComplaintStatus).includes(status as ComplaintStatus) 
      ? status as ComplaintStatus 
      : undefined;
    const validPriority = priority && Object.values(ComplaintPriority).includes(priority as ComplaintPriority) 
      ? priority as ComplaintPriority 
      : undefined;
    const validComplaintType = complaintType && Object.values(ComplaintType).includes(complaintType as ComplaintType) 
      ? complaintType as ComplaintType 
      : undefined;

    // Kiểm tra quyền - chỉ admin mới được xem tất cả complaints
    if (userIdNum && userIdNum !== user.id) {
      const userEntity = await this.complaintsService['usersRepository'].findOne({
        where: { id: user.id },
        relations: ['roles'],
      });

      const isAdmin = userEntity?.roles?.some(role => role.name === 'admin');
      if (!isAdmin) {
        return await this.complaintsService.findAll(pageNum, limitNum, validStatus, user.id);
      }
    }

    return await this.complaintsService.findAll(pageNum, limitNum, validStatus, validPriority, validComplaintType, userIdNum);
  }

  @Get('stats')
  @UseGuards(PermissionsGuard)
  @Permissions('admin')
  async getStats() {
    return await this.complaintsService.getComplaintStats();
  }

  @Get('my-complaints')
  async getMyComplaints(@CurrentUser() user: any) {
    return await this.complaintsService.getComplaintsByUser(user.id);
  }

  @Get('order/:orderId')
  async getComplaintsByOrder(
    @Param('orderId') orderId: string,
    @CurrentUser() user: any,
  ) {
    // Kiểm tra quyền - chỉ admin hoặc user liên quan mới được xem
    const userEntity = await this.complaintsService['usersRepository'].findOne({
      where: { id: user.id },
      relations: ['roles'],
    });

    const isAdmin = userEntity?.roles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      // Kiểm tra xem user có liên quan đến order này không
      // Có thể cần thêm logic kiểm tra quyền sở hữu order
    }

    return await this.complaintsService.getComplaintsByOrder(parseInt(orderId));
  }

  @Get('video/:videoId')
  async getComplaintsByVideo(
    @Param('videoId') videoId: string,
    @CurrentUser() user: any,
  ) {
    // Kiểm tra quyền - chỉ admin hoặc user liên quan mới được xem
    const userEntity = await this.complaintsService['usersRepository'].findOne({
      where: { id: user.id },
      relations: ['roles'],
    });

    const isAdmin = userEntity?.roles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      // Kiểm tra xem user có liên quan đến video này không
      // Có thể cần thêm logic kiểm tra quyền sở hữu video
    }

    return await this.complaintsService.getComplaintsByVideo(parseInt(videoId));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return await this.complaintsService.findOne(parseInt(id), user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateComplaintDto: UpdateComplaintDto,
    @CurrentUser() user: any,
  ) {
    return await this.complaintsService.update(parseInt(id), updateComplaintDto, user.id);
  }

  @Post(':id/evidence/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Chỉ chấp nhận file hình ảnh'), false);
        }
      },
    }),
  )
  async uploadEvidenceImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
    @Body('description') description?: string,
  ) {
    if (!file) {
      throw new Error('Không có file được upload');
    }

    return await this.complaintsService.uploadEvidenceImage(
      parseInt(id), 
      file, 
      user.id, 
      description
    );
  }

  @Patch(':id/priority')
  @UseGuards(PermissionsGuard)
  async priority(
    @Param('id') id: string,
    @Body() resolveComplaintDto: ResolveComplaintDto,
    @CurrentUser() user: any,
  ) {
    return await this.complaintsService.resolve(parseInt(id), resolveComplaintDto, user.id);
  }



  @Patch(':id/resolve')
  @UseGuards(PermissionsGuard)
  async resolve(
    @Param('id') id: string,
    @Body() resolveComplaintDto: ResolveComplaintDto,
    @CurrentUser() user: any,
  ) {
    return await this.complaintsService.resolve(parseInt(id), resolveComplaintDto, user.id);
  }

  @Post(':id/evidence/images')
  async addEvidenceImages(
    @Param('id') id: string,
    @Body() body: { images: Array<{ url: string; description?: string }> },
    @CurrentUser() user: any,
  ) {
    return await this.complaintsService.addEvidenceImages(parseInt(id), body.images, user.id);
  }

  @Delete(':id/evidence/images/:imageIndex')
  async removeEvidenceImage(
    @Param('id') id: string,
    @Param('imageIndex') imageIndex: string,
    @CurrentUser() user: any,
  ) {
    return await this.complaintsService.removeEvidenceImage(parseInt(id), parseInt(imageIndex), user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    await this.complaintsService.remove(parseInt(id), user.id);
    return { message: 'Complaint deleted successfully' };
  }
} 