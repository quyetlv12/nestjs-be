import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MessageType } from '../entities/chat-message.entity';

export class SendMessageDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType = MessageType.TEXT;
} 