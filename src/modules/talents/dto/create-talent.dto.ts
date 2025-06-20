import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  IsArray,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTalentDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'nguyenvana@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '0909123456' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'strongpassword123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  business_id?: number;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  availableFor24hDelivery?: boolean;

  @ApiPropertyOptional({ example: 'Tôi là một lập trình viên tự do...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['lập trình', 'thiết kế'], type: [String] })
  @IsOptional()
  tags?: any;

  @ApiPropertyOptional({ example: '123 Lê Lợi, Hà Nội' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 'Lập trình viên' })
  @IsOptional()
  @IsString()
  job?: string;

  @ApiProperty({ example: 'CoderA' })
  @IsNotEmpty()
  @IsString()
  nick_name: string;

  @ApiPropertyOptional({
    enum: ['active', 'inactive', 'pending'],
    example: 'active',
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'pending'])
  status?: 'active' | 'inactive' | 'pending';

  @ApiPropertyOptional({ type: [Number], example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categories?: any[];
}
