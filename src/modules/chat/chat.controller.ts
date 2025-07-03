import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards
} from '@nestjs/common';
import { Token } from 'src/common/decorators/token.decorator';
import { JwtTokenService } from 'src/common/services/jwt.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageType } from './entities/chat-message.entity';

@Controller('api/chat')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly jwtTokenService: JwtTokenService,) { }

  @Post()
  async createChat(
    @Body() createChatDto: CreateChatDto,
    @Token() token: string
  ) {
    const tokenData = this.jwtTokenService.getTokenData(token);
    return await this.chatService.createChat(tokenData?.userId, createChatDto);
  }

  @Get()
  async getChats(
    @Token() token: string
  ) {
    const tokenData = this.jwtTokenService.getTokenData(token);

    return await this.chatService.getChats(tokenData?.userId);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser('id') currentUserId: number) {
    const count = await this.chatService.getUnreadCount(currentUserId);
    return { unreadCount: count };
  }

  @Get(':id')
  async getChatById(
    @Token() token: string,
    @Param('id', ParseIntPipe) chatId: number,
  ) {
    const tokenData = this.jwtTokenService.getTokenData(token);
    return await this.chatService.getChatById(tokenData.userId, chatId);
  }

  @Post(':id/messages')
  async sendMessage(
    @Token() token: string,
    @Param('id', ParseIntPipe) chatId: number,
    @Body() sendMessageDto: SendMessageDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;
    let fileName: string | undefined;
    let fileUrl: string | undefined;

    if (image) {
      imageUrl = `/uploads/chat-images/${image.filename}`;
      sendMessageDto.type = MessageType.IMAGE;
    }

    const tokenData = this.jwtTokenService.getTokenData(token);

    return await this.chatService.sendMessage(
      tokenData?.userId,
      chatId,
      sendMessageDto,
      imageUrl,
      fileName,
      fileUrl,
    );
  }

  @Put('messages/:messageId/read')
  // @Permissions('chat:read')
  async markMessageAsRead(
    @CurrentUser('id') currentUserId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    await this.chatService.markMessageAsRead(currentUserId, messageId);
    return { message: 'Message marked as read' };
  }

  @Put(':id/messages/read-all')
  // @Permissions('chat:read')
  async markAllMessagesAsRead(
    @CurrentUser('id') currentUserId: number,
    @Param('id', ParseIntPipe) chatId: number,
  ) {
    await this.chatService.markAllMessagesAsRead(currentUserId, chatId);
    return { message: 'All messages marked as read' };
  }

  @Delete(':id')
  // @Permissions('chat:delete')
  async deleteChat(
    @CurrentUser('id') currentUserId: number,
    @Param('id', ParseIntPipe) chatId: number,
  ) {
    await this.chatService.deleteChat(currentUserId, chatId);
    return { message: 'Chat deleted successfully' };
  }
} 