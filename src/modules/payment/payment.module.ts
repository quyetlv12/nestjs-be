import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from 'src/common/services/jwt.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order, User]),
    JwtModule.register({
      secret: 'mysecret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, JwtTokenService, JwtAuthGuard, PermissionsGuard],
  exports: [PaymentService],
})
export class PaymentModule { }
