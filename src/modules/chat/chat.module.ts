import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { User } from '../users/user.entity';
import { JwtTokenService } from 'src/common/services/jwt.service';
import { R2Module } from '../../common/services/r2.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatMessage, User]),
    JwtModule.register({
      secret:   'mysecret',
      signOptions: { expiresIn: '1d' },
    }),
    R2Module
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, JwtTokenService],
  exports: [ChatService, ChatGateway],
})
export class ChatModule { } 