import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  getFileUrl(filename: string, fileType: 'image' | 'video'): string {
    const baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:4000';
    const folder = fileType === 'image' ? 'images' : 'videos';
    return `${baseUrl}/uploads/${folder}/${filename}`;
  }

  getFileType(mimetype: string): 'image' | 'video' {
    if (mimetype.startsWith('image/')) {
      return 'image';
    } else if (mimetype.startsWith('video/')) {
      return 'video';
    }
    throw new Error('Unsupported file type');
  }
} 