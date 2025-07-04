import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { R2Module } from '../../common/services/r2.module';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryProvider } from '../../common/cloudinary.provider';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Determine destination based on file type
          if (file.mimetype.startsWith('image/')) {
            cb(null, 'uploads/images');
          } else if (file.mimetype.startsWith('video/')) {
            cb(null, 'uploads/videos');
          } else {
            cb(new Error('Unsupported file type'), '');
          }
        },
        filename: (req, file, cb) => {
          // Generate unique filename with original extension
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Allow only images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image and video files are allowed'), false);
        }
      },
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
      },
    }),
    R2Module
  ],
  controllers: [UploadController],
  providers: [UploadService, CloudinaryProvider],
  exports: [UploadService, CloudinaryProvider],
})
export class UploadModule {} 