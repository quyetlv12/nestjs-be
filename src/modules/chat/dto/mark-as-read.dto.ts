import { IsNumber, IsNotEmpty } from 'class-validator';

export class MarkAsReadDto {
  @IsNumber()
  @IsNotEmpty()
  messageId: number;
} 