import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ComplaintStatus } from '../entities/complaint.entity';

export class ResolveComplaintDto {
  @IsString()
  @IsNotEmpty()
  resolution: string;

  @IsEnum(ComplaintStatus)
  @IsOptional()
  status?: ComplaintStatus = ComplaintStatus.RESOLVED;
} 