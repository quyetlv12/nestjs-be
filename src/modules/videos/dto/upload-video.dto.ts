import { IsNotEmpty, IsNumber } from 'class-validator';

export class UploadVideoDto {
  @IsNotEmpty()
  title: string;

  @IsNumber()
  createdById: number;
} 