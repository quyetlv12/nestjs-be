import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { User } from '../users/user.entity';
import { Video } from '../videos/entities/video.entity';
import { JwtTokenService } from '@/common/services/jwt.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/common/guards/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Video]),
    JwtModule.register({
      secret: 'mysecret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, JwtTokenService, JwtAuthGuard, PermissionsGuard],
  exports: [OrdersService],
})
export class OrdersModule {}
