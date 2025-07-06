import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ComplaintStatus } from '../entities/complaint.entity';

export class ResolveComplaintDto {
  @IsEnum(ComplaintStatus)
  @IsOptional()
  status?: string;
} 