import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MarkAsReadDto } from './dto/mark-as-read.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { MessageType } from './entities/chat-message.entity';

@Controller('chat')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  // @Permissions('chat:create')
  async createChat(
    @CurrentUser('id') currentUserId: number,
    @Body() createChatDto: CreateChatDto,
  ) {
    return await this.chatService.createChat(currentUserId, createChatDto);
  }

  @Get()
  // @Permissions('chat:read')
  async getChats(@CurrentUser('id') currentUserId: number) {
    return await this.chatService.getChats(currentUserId);
  }

  @Get('unread-count')
  // @Permissions('chat:read')
  async getUnreadCount(@CurrentUser('id') currentUserId: number) {
    const count = await this.chatService.getUnreadCount(currentUserId);
    return { unreadCount: count };
  }

  @Get(':id')
  @Permissions('chat:read')
  async getChatById(
    @CurrentUser('id') currentUserId: number,
    @Param('id', ParseIntPipe) chatId: number,
  ) {
    return await this.chatService.getChatById(currentUserId, chatId);
  }

  @Post(':id/messages')
  // @Permissions('chat:send')
  // @UseInterceptors(
  //   FileInterceptor('image', {
  //     storage: diskStorage({
  //       destination: './uploads/chat-images',
  //       filename: (req, file, cb) => {
  //         const randomName = uuidv4();
  //         return cb(null, `${randomName}${extname(file.originalname)}`);
  //       },
  //     }),
  //     fileFilter: (req, file, cb) => {
  //       if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
  //         cb(null, true);
  //       } else {
  //         cb(new Error('Only image files are allowed!'), false);
  //       }
  //     },
  //     limits: {
  //       fileSize: 5 * 1024 * 1024, // 5MB
  //     },
  //   }),
  // )
  async sendMessage(
    @CurrentUser('id') currentUserId: number,
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

    return await this.chatService.sendMessage(
      currentUserId,
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