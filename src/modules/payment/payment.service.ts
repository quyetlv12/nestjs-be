import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod, PaymentStatus } from './entities/payment.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { PageResponseDto } from '../../common/dto/page-response-dto';
import { PageRequestDto } from '../../common/dto/page-request-dto';
import { Transactional } from 'typeorm-transactional'

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  @Transactional()
  async getPaymentLink(createPaymentDto: CreatePaymentDto): Promise<string> {
    let order = await this.orderRepository.findOne({
      where: { id: createPaymentDto.orderId },
      relations: ['user', 'talent'],
    });

    if (!order) {
      throw new Error('Order not found');
    }
    order.status = OrderStatus.PAID;
    await this.orderRepository.save(order);
    const payment = this.paymentRepository.create({
      amount: order.price,
      currency: 'VND',
      status: PaymentStatus.HOLDING,
      method: PaymentMethod.SEPAY,
      transactionId: `txn-${Date.now()}`,
      description: `Thanh toán cho đơn hàng #${order.id}`,
      user: order.user,
      talent: order.talent,
      order: order,
    });

    await this.paymentRepository.save(payment);
    return "";
  }

  async findByTalentId(talentId: number, request: PageRequestDto): Promise<PageResponseDto<Payment>> {
    const [data, total] = await this.paymentRepository.findAndCount({
      where: { talent: { id: talentId } },
      order: { createdAt: 'DESC' },
      skip: (request.page - 1) * request.limit,
      take: request.limit,
    });

    return new PageResponseDto<Payment>(data, {
      total,
      page: request.page,
      limit: request.limit,
    });
  }

  async findByUserId(userId: number, request: PageRequestDto): Promise<PageResponseDto<Payment>> {
    const [data, total] = await this.paymentRepository.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip: (request.page - 1) * request.limit,
      take: request.limit,
    });

    return new PageResponseDto<Payment>(data, {
      total,
      page: request.page,
      limit: request.limit,
    });
  }

  async findAll(request: PageRequestDto): Promise<PageResponseDto<Payment>> {
    const [data, total] = await this.paymentRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (request.page - 1) * request.limit,
      take: request.limit,
    });

    return new PageResponseDto<Payment>(data, {
      total,
      page: request.page,
      limit: request.limit,
    });
  }

  async getTotalRevenue(): Promise<number> {
    const result = await this.orderRepository
      .createQueryBuilder('orders')
      .select('SUM(orders.price)', 'sum')
      .where('orders.status = :status', { status: 'completed' })
      .getRawOne();
    return Number(result.sum) || 0;
  }
}
