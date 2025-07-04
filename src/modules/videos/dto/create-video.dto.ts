import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({ example: 'Giới thiệu về NestJS' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'đầy trường file từ formdata lên để upload lên cloudinary sau đó tự động gắn link vào trường này',
  })
  @IsOptional()
  @IsString()
  videoLink: string;

  @ApiProperty({ example: '5:32', description: 'Thời lượng video (ví dụ: 5:32)' })
  @IsNotEmpty()
  @IsString()
  duration: string;


  @ApiProperty({ example: 1, description: 'Thumbnail của video' })
  @IsOptional()
  @IsString()
  thumbnailLink: string;


  @ApiProperty({ example: 1, description: 'ID của người tạo video (user)' })
  @IsOptional()
  @IsNumber()
  createdById: number;
}
