import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateComplaintDto, EvidenceDto } from './create-complaint.dto';
import { ComplaintStatus, ComplaintPriority, ComplaintType } from '../entities/complaint.entity';

export class UpdateComplaintDto extends PartialType(CreateComplaintDto) {
  @IsEnum(ComplaintStatus)
  @IsOptional()
  status?: ComplaintStatus;

  @IsEnum(ComplaintPriority)
  @IsOptional()
  priority?: ComplaintPriority;

  @IsEnum(ComplaintType)
  @IsOptional()
  complaintType?: ComplaintType;

  @IsString()
  @IsOptional()
  resolution?: string;

  @ValidateNested()
  @Type(() => EvidenceDto)
  @IsOptional()
  evidence?: EvidenceDto;
} 