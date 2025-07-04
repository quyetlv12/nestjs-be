import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { memoryStorage } from 'multer';
import { R2Service } from '../../common/services/r2.service';

@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService , private readonly r2Service: R2Service) {}

  // @Post('image')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadImage(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new BadRequestException('No file uploaded');
  //   }

  //   if (!file.mimetype.startsWith('image/')) {
  //     throw new BadRequestException('File must be an image');
  //   }

  //   const fileType = this.uploadService.getFileType(file.mimetype);
  //   const fileUrl = this.uploadService.getFileUrl(file.filename, fileType);

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Image uploaded successfully',
  //     data: {
  //       filename: file.filename,
  //       originalName: file.originalname,
  //       mimetype: file.mimetype,
  //       size: file.size,
  //       url: fileUrl,
  //     },
  //   };
  // }

  // @Post('video')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadVideo(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new BadRequestException('No file uploaded');
  //   }

  //   if (!file.mimetype.startsWith('video/')) {
  //     throw new BadRequestException('File must be a video');
  //   }

  //   const fileType = this.uploadService.getFileType(file.mimetype);
  //   const fileUrl = this.uploadService.getFileUrl(file.filename, fileType);

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Video uploaded successfully',
  //     data: {
  //       filename: file.filename,
  //       originalName: file.originalname,
  //       mimetype: file.mimetype,
  //       size: file.size,
  //       url: fileUrl,
  //     },
  //   };
  // }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // DÙNG cái này thay vì diskStorage
      limits: { fileSize: 50 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
      if (
        file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/')
      ) {
        cb(null, true);
      } else {
        cb(new Error('Only image and video files are allowed!'), false);
      }
    },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {  
    const url = await this.r2Service.uploadFile(file);
    return { url };
  }
}
