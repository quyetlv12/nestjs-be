import { getFileType } from '../../helper';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  getFileUrl(filename: string, fileType: 'image' | 'video'): string {
    const baseUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:4000';
    const folder = fileType === 'image' ? 'images' : 'videos';
    return `${baseUrl}/uploads/${folder}/${filename}`;
  }

  getFileType(mimetype: string): 'image' | 'video' {
    if (mimetype.startsWith('image/')) {
      return 'image';
    } else if (mimetype.startsWith('video/')) {
      return 'video';
    }
    throw new Error('Định dạng tệp không được hỗ trợ');
  }
  async uploadImageCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: getFileType(file?.mimetype),
            resource_type: 'auto', // dùng được cả ảnh và video
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as UploadApiResponse);
          },
        )
        .end(file.buffer);
    });
  }
}
