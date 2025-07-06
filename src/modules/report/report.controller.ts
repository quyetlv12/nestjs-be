import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TalentsService } from '../talents/talents.service';
import { OrdersService } from '../orders/orders.service';
import { PaymentService } from '../payment/payment.service';
import { ComplaintsService } from '../complaints/complaints.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ComplaintStatus } from '../complaints/entities/complaint.entity';
import { Token } from 'src/common/decorators/token.decorator';
import { JwtTokenService } from 'src/common/services/jwt.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { OrderStatus } from '../orders/entities/order.entity';
import { CommentsService } from '../comments/comments.service';
import { Between } from 'typeorm';

@Controller('api/report')
export class ReportController {
  constructor(
    private readonly usersService: UsersService,
    private readonly talentsService: TalentsService,
    private readonly ordersService: OrdersService,
    private readonly paymentService: PaymentService,
    private readonly complaintsService: ComplaintsService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSummary(@Token() token) {
    // Nếu là admin (có quyền 'admin' hoặc 'view_user_list')
    const user = this.jwtTokenService.getTokenData(token);

    const isAdmin = user?.permissions?.includes('view_user_list');
    if (isAdmin) {
      const totalUsers = await this.usersService['userRepository'].count();
      const totalTalents = await this.talentsService['talentRepository'].count({
        where: { roles: { name: 'talent' } },
      });
      const totalOrders = await this.ordersService['orderRepository'].count();
      const totalRevenue = await this.paymentService.getTotalRevenue();
      const complaintStats = await this.complaintsService.getComplaintStats();
      const pendingTalents = await this.talentsService[
        'talentRepository'
      ].count({ where: { status: 'pending', roles: { name: 'talent' } } });
      
     

      return {
        totalUsers,
        totalTalents,
        totalOrders,
        totalRevenue,
        complaintsPending: complaintStats.pending,
        talentsPending: pendingTalents,
      };
    } else {
      // User thường: chỉ trả về số liệu liên quan đến tài khoản
      const userId = user?.userId;
      const totalOrders = await this.ordersService['orderRepository'].count({
        where: { user: { id: userId } },
      });
      const totalRevenue = await this.paymentService['paymentRepository']
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'sum')
        .where('payment.userId = :userId', { userId })
        .andWhere('payment.status = :status', { status: 'SUCCESS' })
        .getRawOne()
        .then((r) => Number(r.sum) || 0);
      const complaintsPending = await this.complaintsService[
        'complaintsRepository'
      ].count({ where: { userId, status: ComplaintStatus.PENDING } });

      const ordersPending = await this.ordersService['orderRepository'].count({
        where: { status: OrderStatus.PENDING },
      });

      const ordersCompleted = await this.ordersService['orderRepository'].count({
        where: { status: OrderStatus.COMPLETED },
      });

      // Tính tổng số sao trung bình từ bảng comments
      const averageRating = await this.commentsService['commentRepository']
        .createQueryBuilder('comment')
        .select('AVG(comment.star)', 'average')
        .getRawOne()
        .then((r) => Number(r.average) || 0);

      // Lấy ngày đầu và cuối tháng hiện tại
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Đơn hoàn thành trong tháng này
      const completedOrdersThisMonth = await this.ordersService['orderRepository'].count({
        where: {
          user: { id: userId },
          status: OrderStatus.COMPLETED,
          updatedAt: Between(startOfMonth, endOfMonth),
        },
      });

      // Tổng số đơn trong tháng này (mọi trạng thái)
      const totalOrdersThisMonth = await this.ordersService['orderRepository'].count({
        where: {
          user: { id: userId },
          createdAt: Between(startOfMonth, endOfMonth),
        },
      });

      // Tỷ lệ hoàn thành trong tháng này
      const completionRateThisMonth = totalOrdersThisMonth > 0
        ? Math.round((completedOrdersThisMonth / totalOrdersThisMonth) * 100)
        : 0;

      // Đánh giá trung bình trong tháng này
      const averageRatingThisMonth = await this.commentsService['commentRepository']
        .createQueryBuilder('comment')
        .select('AVG(comment.star)', 'average')
        .where('comment.userId = :userId', { userId })
        .andWhere('comment.createdAt BETWEEN :start AND :end', { start: startOfMonth, end: endOfMonth })
        .getRawOne()
        .then((r) => Number(r.average) || 0);

      // Thu nhập trong tháng này
      const revenueThisMonth = await this.paymentService['paymentRepository']
        .createQueryBuilder('payment')
        .select('SUM(payment.amount)', 'sum')
        .where('payment.userId = :userId', { userId })
        .andWhere('payment.status = :status', { status: 'SUCCESS' })
        .andWhere('payment.createdAt BETWEEN :start AND :end', { start: startOfMonth, end: endOfMonth })
        .getRawOne()
        .then((r) => Number(r.sum) || 0);

      
      return {
        totalOrders,
        totalRevenue,
        complaintsPending,
        ordersPending,
        ordersCompleted,
        averageRating,


        completedOrdersThisMonth,
        completionRateThisMonth,
        averageRatingThisMonth,
        revenueThisMonth
      };
    }
  }
}
