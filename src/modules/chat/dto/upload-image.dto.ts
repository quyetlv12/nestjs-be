import { IsNumber, IsNotEmpty } from 'class-validator';

export class UploadImageDto {
  @IsNumber()
  @IsNotEmpty()
  chatId: number;
} 