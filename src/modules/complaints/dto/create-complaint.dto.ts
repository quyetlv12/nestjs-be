import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsObject, IsArray, ArrayMaxSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ComplaintType, ComplaintPriority } from '../entities/complaint.entity';

export class EvidenceImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class EvidenceDto {
  @IsArray()
  @ArrayMaxSize(5, { message: 'Tối đa 5 hình ảnh được phép' })
  @ValidateNested({ each: true })
  @Type(() => EvidenceImageDto)
  @IsOptional()
  images?: EvidenceImageDto[];

  @IsString()
  @IsOptional()
  evidenceDescription?: string;

  @IsObject()
  @IsOptional()
  additionalData?: any;
}

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ComplaintType)
  complaintType: ComplaintType;

  @IsEnum(ComplaintPriority)
  @IsOptional()
  priority?: ComplaintPriority = ComplaintPriority.MEDIUM;

  @ValidateNested()
  @Type(() => EvidenceDto)
  @IsOptional()
  evidence?: EvidenceDto;

  @IsNumber()
  @Type(() => Number)
  orderId: number;

  @IsNumber()
  @Type(() => Number)
  videoId: number;
} 