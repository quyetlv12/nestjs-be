import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ComplaintsModule } from '../complaints/complaints.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentModule } from '../payment/payment.module';
import { TalentsModule } from '../talents/talents.module';
import { UsersModule } from '../users/users.module';
import { ReportController } from './report.controller';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtTokenService } from 'src/common/services/jwt.service';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    UsersModule,
    TalentsModule,
    OrdersModule,
    PaymentModule,
    ComplaintsModule,
    CommentsModule,
    JwtModule.register({
      secret: 'mysecret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ReportController],
  providers : [JwtTokenService, JwtAuthGuard, PermissionsGuard ]
})
export class ReportModule {}
