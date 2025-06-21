import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsNumber, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Loại đơn hàng',
    example: 'birthday_video',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Email nhận thông tin đơn hàng',
    example: 'customer@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phương thức giao video',
    enum: ['7days', '24hours'],
    default: '24hours',
    example: '24hours',
  })
  @IsEnum(['7days', '24hours'])
  video_protocol_method: '7days' | '24hours';

  @ApiProperty({
    description: 'ID của talent',
    example: 1,
  })
  @IsNumber()
  talentId: number;

  @ApiProperty({
    description: 'Người nhận video',
    enum: ['someone_else', 'myself'],
    default: 'someone_else',
    example: 'someone_else',
  })
  @IsEnum(['someone_else', 'myself'])
  recipient: 'someone_else' | 'myself';

  @ApiProperty({
    description: 'Giới tính người nhận',
    example: 'male',
  })
  @IsString()
  for_gender: string;

  @ApiProperty({
    description: 'Giá đơn hàng',
    example: 100000,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    example: 'credit_card',
  })
  @IsString()
  paymentMethod: string;

  @ApiProperty({
    description: 'Trạng thái thanh toán',
    example: 'pending',
  })
  @IsString()
  paymentStatus: string;

  @ApiProperty({
    description: 'Ngày thanh toán',
    required: false,
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @ApiProperty({
    description: 'Chi tiết yêu cầu',
    example: 'Tôi muốn một video chúc mừng sinh nhật',
  })
  @IsString()
  request_details: string;

  @ApiProperty({
    description: 'Link video mẫu',
    required: false,
    example: 'https://example.com/sample-video.mp4',
  })
  @IsOptional()
  @IsString()
  example_video_link?: string;

  @ApiProperty({
    description: 'Người gửi video',
    example: 'John Doe',
  })
  @IsString()
  video_from: string;

  @ApiProperty({
    description: 'Giới tính người gửi video',
    example: 'male',
  })
  @IsString()
  video_from_gender: string;

  @ApiProperty({
    description: 'Ẩn thông tin người gửi video',
    default: false,
    example: false,
  })
  @IsBoolean()
  hide_video_from: boolean;

  @ApiProperty({
    description: 'ID của user',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'ID của video',
    example: 1,
  })
  @IsNumber()
  videoId: number;

  @ApiProperty({
    description: 'Link video',
    example: 'https://example.com/video.mp4',
  })
  @IsString()
  video_link: string;
}
