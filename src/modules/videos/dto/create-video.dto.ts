import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({ example: 'Giới thiệu về NestJS' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'đầy trường file từ formdata lên để upload lên cloudinary sau đó tự động gắn link vào trường này',
  })
  @IsNotEmpty()
  @IsString()
  videoLink: string;

  @ApiProperty({ example: '5:32', description: 'Thời lượng video (ví dụ: 5:32)' })
  @IsNotEmpty()
  @IsString()
  duration: string;

  @ApiProperty({ example: 1, description: 'Giá của video' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 1, description: 'Thumbnail của video' })
  @IsNotEmpty()
  @IsString()
  thumbnailLink: string;


  @ApiProperty({ example: 1, description: 'ID của người tạo video (user)' })
  @IsNotEmpty()
  @IsNumber()
  createdById: number;
}
