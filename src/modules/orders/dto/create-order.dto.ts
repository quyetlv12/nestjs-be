import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Loại đơn hàng',
    example: 'birthday_video',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Phương thức giao video',
    enum: ['7days', '24hours'],
    default: '24hours',
    example: '24hours',
  })
  @IsEnum(['7days', '24hours'])
  @IsOptional()
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
  @IsOptional()
  for_gender: string;

  @ApiProperty({
    description: 'Chi tiết yêu cầu',
    example: 'Tôi muốn một video chúc mừng sinh nhật',
  })
  @IsString()
  request_details: string;
}
