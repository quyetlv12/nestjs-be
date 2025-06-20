import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({ example: 'Giới thiệu về NestJS' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/video/upload/v123456/video.mp4',
  })
  @IsNotEmpty()
  @IsString()
  videoLink: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/v123456/thumb.jpg',
  })
  @IsNotEmpty()
  @IsString()
  thumbnailLink: string;

  @ApiProperty({ example: '5:32', description: 'Thời lượng video (ví dụ: 5:32)' })
  @IsNotEmpty()
  @IsString()
  duration: string;

  @ApiProperty({ example: 1, description: 'ID của người tạo video (user)' })
  @IsNotEmpty()
  @IsNumber()
  createdById: number;
}
