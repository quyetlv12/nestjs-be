import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  @IsNotEmpty()
  participant2Id: number;
} 