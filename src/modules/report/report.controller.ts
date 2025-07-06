import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TalentsService } from '../talents/talents.service';
import { OrdersService } from '../orders/orders.service';
import { PaymentService } from '../payment/payment.service';
import { ComplaintsService } from '../complaints/complaints.service';

@Controller('api/report')
export class ReportController {
  constructor(
    private readonly usersService: UsersService,
    private readonly talentsService: TalentsService,
    private readonly ordersService: OrdersService,
    private readonly paymentService: PaymentService,
    private readonly complaintsService: ComplaintsService,
  ) {}

  @Get('summary')
  async getSummary() {
    // Tổng số user
    const totalUsers = await this.usersService['userRepository'].count();
    // Tổng số talent
    const totalTalents = await this.talentsService['talentRepository'].count({ where: { roles: { name: 'talent' } } });
    // Tổng số đơn hàng
    const totalOrders = await this.ordersService['orderRepository'].count();
    // Tổng doanh thu (chỉ tính payment thành công)
    const totalRevenue = await this.paymentService.getTotalRevenue();
    // Khiếu nại chờ xử lý
    const complaintStats = await this.complaintsService.getComplaintStats();
    // Đơn chờ duyệt (ví dụ: talent status = 'pending')
    const pendingTalents = await this.talentsService['talentRepository'].count({ where: { status: 'pending', roles: { name: 'talent' } } });

    return {
      totalUsers,
      totalTalents,
      totalOrders,
      totalRevenue,
      complaintsPending: complaintStats.pending,
      talentsPending: pendingTalents,
    };
  }
} 