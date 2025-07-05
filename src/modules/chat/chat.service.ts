import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMessage, MessageType } from './entities/chat-message.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { User } from '../users/user.entity';
import { R2Service } from '../../common/services/r2.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly r2Service: R2Service,
  ) {}

  async createChat(currentUserId: number, createChatDto: CreateChatDto): Promise<Chat> {
    const { participant2Id } = createChatDto;

    // Check if both users exist
    const participant2 = await this.userRepository.findOne({ where: { id: participant2Id } });
    if (!participant2) {
      throw new NotFoundException('User not found');
    }

    // Check if chat already exists
    const existingChat = await this.chatRepository.findOne({
      where: [
        { participant1Id: currentUserId, participant2Id },
        { participant1Id: participant2Id, participant2Id: currentUserId },
      ],
    });

    if (existingChat) {
      return existingChat;
    }

    // Create new chat
    const chat = this.chatRepository.create({
      participant1Id: currentUserId,
      participant2Id,
    });

    return await this.chatRepository.save(chat);
  }

  async getChats(currentUserId: number): Promise<any[]> {
    const chats = await this.chatRepository.find({
      where: [
        { participant1Id: currentUserId, isActive: true },
        { participant2Id: currentUserId, isActive: true },
      ],
      relations: ['participant1', 'participant2', 'messages'],
      order: { updatedAt: 'DESC' },
    });

    return chats.map(chat => {
      let otherParticipant;
      if (chat.participant1Id === currentUserId) {
        otherParticipant = chat.participant2;
      } else {
        otherParticipant = chat.participant1;
      }

      // Get the last message
      const lastMessage = chat.messages && chat.messages.length > 0 
        ? chat.messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
        : null;

      return {
        ...chat,
        displayUser: otherParticipant,
        lastMessage,
      };
    });
  }

  async getChatById(currentUserId: number, chatId: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['participant1', 'participant2', 'messages', 'messages.sender'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Sort messages by createdAt
    chat.messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Check if user is participant
    if (chat.participant1Id !== currentUserId && chat.participant2Id !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }

    return chat;
  }

  async sendMessage(
    currentUserId: number,
    chatId: number,
    sendMessageDto: SendMessageDto,
    imageUrl?: string,
    fileName?: string,
    fileUrl?: string,
  ): Promise<ChatMessage> {
    const chat = await this.getChatById(currentUserId, chatId);

    const newMessage = this.chatMessageRepository.create({
      chatId,
      senderId: currentUserId,
      type: sendMessageDto.type || MessageType.TEXT,
      content: sendMessageDto.content,
      imageUrl,
      fileName,
      fileUrl,
    });

    const savedMessage = await this.chatMessageRepository.save(newMessage);

    // Update chat's updatedAt
    await this.chatRepository.update(chatId, { updatedAt: new Date() });

    const message = await this.chatMessageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async markMessageAsRead(currentUserId: number, messageId: number): Promise<void> {
    const message = await this.chatMessageRepository.findOne({
      where: { id: messageId },
      relations: ['chat'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user is participant in the chat
    if (message.chat.participant1Id !== currentUserId && message.chat.participant2Id !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }

    // Only mark as read if user is not the sender
    if (message.senderId !== currentUserId) {
      await this.chatMessageRepository.update(messageId, { isRead: true });
    }
  }

  async markAllMessagesAsRead(currentUserId: number, chatId: number): Promise<void> {
    const chat = await this.getChatById(currentUserId, chatId);

    await this.chatMessageRepository.update(
      {
        chatId,
        senderId: chat.participant1Id === currentUserId ? chat.participant2Id : chat.participant1Id,
        isRead: false,
      },
      { isRead: true },
    );
  }

  async getUnreadCount(currentUserId: number): Promise<number> {
    const chats = await this.chatRepository.find({
      where: [
        { participant1Id: currentUserId, isActive: true },
        { participant2Id: currentUserId, isActive: true },
      ],
    });

    const chatIds = chats.map(chat => chat.id);

    return await this.chatMessageRepository.count({
      where: {
        senderId: Not(currentUserId),
        isRead: false,
        chatId: In(chatIds),
      },
    });
  }

  async deleteChat(currentUserId: number, chatId: number): Promise<void> {
    const chat = await this.getChatById(currentUserId, chatId);

    // Soft delete by setting isActive to false
    await this.chatRepository.update(chatId, { isActive: false });
  }

  async uploadImage(
    currentUserId: number,
    chatId: number,
    file: Express.Multer.File,
  ): Promise<ChatMessage> {
    // Kiểm tra chat tồn tại và user có quyền truy cập
    const chat = await this.getChatById(currentUserId, chatId);

    // Kiểm tra định dạng file
    if (!file.mimetype.startsWith('image/')) {
      throw new ForbiddenException('Chỉ chấp nhận file hình ảnh');
    }

    // Kiểm tra kích thước file (tối đa 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new ForbiddenException('Kích thước file không được vượt quá 10MB');
    }

    try {
      // Upload lên R2
      const imageUrl = await this.r2Service.uploadFile(file);

      // Tạo message mới với type IMAGE
      const newMessage = this.chatMessageRepository.create({
        chatId,
        senderId: currentUserId,
        type: MessageType.IMAGE,
        content: file.originalname, // Lưu tên file gốc
        imageUrl,
        fileName: file.originalname,
      });

      const savedMessage = await this.chatMessageRepository.save(newMessage);

      // Update chat's updatedAt
      await this.chatRepository.update(chatId, { updatedAt: new Date() });

      const message = await this.chatMessageRepository.findOne({
        where: { id: savedMessage.id },
        relations: ['sender'],
      });

      if (!message) {
        throw new NotFoundException('Message not found');
      }

      return message;
    } catch (error) {
      throw new ForbiddenException('Lỗi khi upload hình ảnh: ' + error.message);
    }
  }
} 