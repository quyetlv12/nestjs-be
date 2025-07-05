import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UploadImageDto } from './dto/upload-image.dto';
import { ChatMessage } from './entities/chat-message.entity';
import { UseGuards, Logger } from '@nestjs/common';
import { R2Service } from '../../common/services/r2.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');
  private onlineUsers: Map<number, string> = new Map(); // userId -> socketId

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly r2Service: R2Service,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Chat Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;  
      if (!token) {
        console.log('[Gateway] ❌ No token provided');
        client.disconnect();
        return;
      }
  
      const payload = this.jwtService.verify(token); // <-- có thể throw lỗi
  
      client.data.user = payload;
      this.onlineUsers.set(payload.id, client.id);
      
      this.logger.log(`Client connected: ${payload.id}`);
      
      // Thông báo cho tất cả user khác biết user này online
      client.broadcast.emit('user_online', { userId: payload.id });
    } catch (err) {
      console.error('[Gateway] ❌ JWT verify failed:', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const user = client.data?.user;
    if (user) {
      this.onlineUsers.delete(user.id);
      this.logger.log(`Client disconnected: ${user.id}`);
      
      // Thông báo cho tất cả user khác biết user này offline
      client.broadcast.emit('user_offline', { userId: user.id });
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: number; message: SendMessageDto },
  ) {
    const user = client.data.user;
    if (!user) return;
    
    try {
      const message: ChatMessage = await this.chatService.sendMessage(
        user.id,
        data.chatId,
        data.message,
      );
      
      // Gửi tin nhắn cho tất cả user trong chat room (bao gồm cả người gửi)
      this.emitMessageToChat(data.chatId, 'receive_message', message);
      
      // Log để debug
      this.logger.log(`Message sent in chat ${data.chatId} by user ${user.id}: ${message.content}`);
      
      // Dừng typing indicator khi gửi tin nhắn
      this.emitMessageToChat(data.chatId, 'stop_typing', { userId: user.id });
      
      return message;
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: number },
  ) {
    const user = client.data.user;
    if (!user) return;
    
    client.join(`chat_${data.chatId}`);
    this.logger.log(`User ${user.id} joined chat ${data.chatId}`);
    
    // Gửi danh sách user online trong chat
    const chat = await this.chatService.getChatById(user.id, data.chatId);
    const onlineParticipants: number[] = [];
    
    if (chat.participant1Id !== user.id && this.onlineUsers.has(chat.participant1Id)) {
      onlineParticipants.push(chat.participant1Id);
    }
    if (chat.participant2Id !== user.id && this.onlineUsers.has(chat.participant2Id)) {
      onlineParticipants.push(chat.participant2Id);
    }
    
    client.emit('chat_online_users', { chatId: data.chatId, onlineUsers: onlineParticipants });
    
    return { joined: data.chatId };
  }

  @SubscribeMessage('leave_chat')
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: number },
  ) {
    const user = client.data.user;
    if (!user) return;
    
    client.leave(`chat_${data.chatId}`);
    this.logger.log(`User ${user.id} left chat ${data.chatId}`);
    return { left: data.chatId };
  }

  @SubscribeMessage('start_typing')
  async handleStartTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: number },
  ) {
    const user = client.data.user;
    if (!user) return;
    
    // Gửi thông báo đang nhập cho tất cả user trong chat (trừ người gửi)
    client.to(`chat_${data.chatId}`).emit('user_typing', { 
      chatId: data.chatId, 
      userId: user.id,
      username: user.username || user.email 
    });
  }

  @SubscribeMessage('stop_typing')
  async handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: number },
  ) {
    const user = client.data.user;
    if (!user) return;
    
    // Gửi thông báo dừng nhập cho tất cả user trong chat (trừ người gửi)
    client.to(`chat_${data.chatId}`).emit('user_stop_typing', { 
      chatId: data.chatId, 
      userId: user.id 
    });
  }

  @SubscribeMessage('get_online_users')
  async handleGetOnlineUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: number },
  ) {
    const user = client.data.user;
    if (!user) return;
    
    try {
      const chat = await this.chatService.getChatById(user.id, data.chatId);
      const onlineParticipants: number[] = [];
      
      if (this.onlineUsers.has(chat.participant1Id)) {
        onlineParticipants.push(chat.participant1Id);
      }
      if (this.onlineUsers.has(chat.participant2Id)) {
        onlineParticipants.push(chat.participant2Id);
      }
      
      client.emit('online_users_response', { 
        chatId: data.chatId, 
        onlineUsers: onlineParticipants 
      });
    } catch (error) {
      client.emit('error', { message: 'Failed to get online users' });
    }
  }

  @SubscribeMessage('upload_image')
  async handleUploadImage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: UploadImageDto & { file: Express.Multer.File },
  ) {
    const user = client.data.user;
    if (!user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    try {
      // Kiểm tra định dạng file
      if (!data.file.mimetype.startsWith('image/')) {
        client.emit('error', { message: 'Chỉ chấp nhận file hình ảnh' });
        return;
      }

      // Kiểm tra kích thước file (tối đa 10MB)
      if (data.file.size > 10 * 1024 * 1024) {
        client.emit('error', { message: 'Kích thước file không được vượt quá 10MB' });
        return;
      }

      // Upload ảnh và tạo message
      const message: ChatMessage = await this.chatService.uploadImage(
        user.id,
        data.chatId,
        data.file,
      );

      // Gửi tin nhắn cho tất cả user trong chat room (bao gồm cả người gửi)
      this.emitMessageToChat(data.chatId, 'receive_message', message);
      
      this.logger.log(`Image uploaded in chat ${data.chatId} by user ${user.id}: ${message.imageUrl}`);
      
      // Dừng typing indicator khi gửi tin nhắn
      this.emitMessageToChat(data.chatId, 'stop_typing', { userId: user.id });
      
      return message;
    } catch (error) {
      this.logger.error(`Error uploading image: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  // Helper method để kiểm tra user có online không
  isUserOnline(userId: number): boolean {
    return this.onlineUsers.has(userId);
  }

  // Helper method để lấy socket ID của user
  getUserSocketId(userId: number): string | undefined {
    return this.onlineUsers.get(userId);
  }

  emitMessageToChat(chatId: number, event: string, data: any) {
    this.server.to(`chat_${chatId}`).emit(event, data);
  }
} 