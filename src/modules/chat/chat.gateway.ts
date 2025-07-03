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
import { ChatMessage } from './entities/chat-message.entity';
import { UseGuards, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Chat Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      console.log('[Gateway] Token received:', token);
  
      if (!token) {
        console.log('[Gateway] ❌ No token provided');
        client.disconnect();
        return;
      }
  
      const payload = this.jwtService.verify(token); // <-- có thể throw lỗi
      console.log('[Gateway] ✅ JWT payload:', payload);
  
      client.data.user = payload;
      this.logger.log(`Client connected: ${payload.id}`);
    } catch (err) {
      console.error('[Gateway] ❌ JWT verify failed:', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.data?.user?.id}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: number; message: SendMessageDto },
  ) {
    const user = client.data.user;
    if (!user) return;
    const message: ChatMessage = await this.chatService.sendMessage(
      user.id,
      data.chatId,
      data.message,
    );
    // Gửi tin nhắn cho cả 2 participant
    this.server.to(`chat_${data.chatId}`).emit('receive_message', message);
    return message;
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: number },
  ) {
    client.join(`chat_${data.chatId}`);
    this.logger.log(`User ${client.data.user?.id} joined chat ${data.chatId}`);
    return { joined: data.chatId };
  }

  @SubscribeMessage('leave_chat')
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: number },
  ) {
    client.leave(`chat_${data.chatId}`);
    this.logger.log(`User ${client.data.user?.id} left chat ${data.chatId}`);
    return { left: data.chatId };
  }
} 