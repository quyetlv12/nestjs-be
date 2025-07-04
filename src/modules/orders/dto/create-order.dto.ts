import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

// 🔸 Enum cho phương thức giao video
export enum VideoProtocolMethod {
  SEVEN_DAYS = '7days',
  TWENTY_FOUR_HOURS = '24hours',
}

// 🔸 Enum cho người nhận video
export enum RecipientType {
  SOMEONE_ELSE = 'someone_else',
  MYSELF = 'myself',
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Loại đơn hàng',
    example: 'birthday_video',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Phương thức giao video',
    enum: VideoProtocolMethod,
    default: VideoProtocolMethod.TWENTY_FOUR_HOURS,
    example: VideoProtocolMethod.TWENTY_FOUR_HOURS,
    required: false,
  })
  @IsEnum(VideoProtocolMethod)
  @IsOptional()
  video_protocol_method?: VideoProtocolMethod;

  @ApiProperty({
    description: 'ID của talent',
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  talentId: number;

  @ApiProperty({
    description: 'Người nhận video',
    enum: RecipientType,
    default: RecipientType.SOMEONE_ELSE,
    example: RecipientType.SOMEONE_ELSE,
  })
  @IsEnum(RecipientType)
  recipient: RecipientType;

  @ApiProperty({
    description: 'Giới tính người nhận (tuỳ chọn)',
    example: 'male',
    required: false,
  })
  @IsString()
  @IsOptional()
  for_gender?: string;

  @ApiProperty({
    description: 'Chi tiết yêu cầu',
    example: 'Tôi muốn một video chúc mừng sinh nhật thật hài hước!',
  })
  @IsString()
  request_details: string;
}
