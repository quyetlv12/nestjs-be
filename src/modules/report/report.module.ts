import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { UsersModule } from '../users/users.module';
import { TalentsModule } from '../talents/talents.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentModule } from '../payment/payment.module';
import { ComplaintsModule } from '../complaints/complaints.module';

@Module({
  imports: [UsersModule, TalentsModule, OrdersModule, PaymentModule, ComplaintsModule],
  controllers: [ReportController],
})
export class ReportModule {} 