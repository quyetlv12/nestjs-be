import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, VideoProtocolMethod, RecipientType, OrderStatus } from './entities/order.entity';
import { User } from '../users/user.entity';
import { PageResponseDto } from '../../common/dto/page-response-dto';
import { OrderSearchRequestDto } from './dto/order-search-request-dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {

    // Kiểm tra xem talent có tồn tại không
    const talent = await this.userRepository.findOne({ where: { id: createOrderDto.talentId } });
    if (!talent) {
      throw new NotFoundException(`Talent with ID ${createOrderDto.talentId} not found`);
    }

   const user = await this.userRepository.findOne({ where: { id: userId } });
   if (!user) {
     throw new NotFoundException(`User with ID ${userId} not found`);
   }

    const orderData = {
      ...createOrderDto,
      video_protocol_method: createOrderDto.video_protocol_method as VideoProtocolMethod,
      recipient: createOrderDto.recipient as RecipientType,
      status: OrderStatus.PENDING,
      user: user,
      talent: talent,
      price: talent.price 
    };
    
    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  async reject(id: number, user: any): Promise<Order> {
    const order = await this.findOne(id);
    if (order.talent.id !== user.id) {
      throw new NotFoundException(`Talent với ID ${user.id} không thể từ chối đơn hàng với ID ${id}`);
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new NotFoundException(`Không thể từ chối đơn hàng với ID ${id} vì trạng thái không phải là PENDING`);
    }
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }
    order.status = OrderStatus.REJECTED;
    return await this.orderRepository.save(order);
  }

  async accept(id: number, user: any): Promise<Order> {
    const order = await this.findOne(id);
    if (order.talent.id !== user.id) {
      throw new NotFoundException(`Talent với ID ${user.id} không thể chấp nhận đơn hàng với ID ${id}`);
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new NotFoundException(`Không thể chấp nhận đơn hàng với ID ${id} vì trạng thái không phải là PENDING`);
    }
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }
    order.status = OrderStatus.PROCESSING;
    return await this.orderRepository.save(order);
  }

  async cancel(id: number, user: any): Promise<Order> {
    const order = await this.findOne(id);
    if (order.user.id !== user.userId) {
      throw new NotFoundException(`User với ID ${user.id} không thể hủy đơn hàng với ID ${id}`);
    }
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new NotFoundException(`Không thể hủy đơn hàng với ID ${id} vì trạng thái không phải là PENDING`);
    }
    order.status = OrderStatus.CANCELLED;
    return await this.orderRepository.save(order);
  }

  async search(request: OrderSearchRequestDto): Promise<PageResponseDto<Order>> {
    const where: any = {};
    if (request.startDate) {
      where.createdAt = { $gte: request.startDate };
    }
    if (request.endDate) {
      where.createdAt = { ...where.createdAt, $lte: request.endDate };
    }
    if (request.status) {
      where.status = request.status;
    }
    
    const [data, total] = await this.orderRepository.findAndCount({
      where: where,
      relations: ['user', 'talent'],
      order: { createdAt: 'DESC' },
      skip: (request.page - 1) * request.limit,
      take: request.limit,
    });

    return new PageResponseDto(data, {
      total,
      page: request.page,
      limit: request.limit,
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'talent'],
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID ${id}`);
    }

    return order;
  }

  async findByUserId(userId: number, request: OrderSearchRequestDto): Promise<PageResponseDto<Order>> {
    const where: any = { user: { id: userId } };
    if (request.status) {
      where.status = request.status;
    }
    const [data, total] = await this.orderRepository.findAndCount({
      where: where,
      relations: ['user', 'talent'],
      order: { createdAt: 'DESC' },
      skip: (request.page - 1) * request.limit,
      take: request.limit,
    });
    return new PageResponseDto(data, {
      total,
      page: request.page,
      limit: request.limit,
    });
  }

  async findByTalentId(talentId: number, request: OrderSearchRequestDto): Promise<PageResponseDto<Order>> {

    const where: any = {
      talent: { id: talentId },
    };

    if (request.status) {
      where.status = request.status;
    }

    const [data, total] = await this.orderRepository.findAndCount({
      where : where,
      relations: ['user', 'talent'],
      order: { createdAt: 'DESC' },
      skip: (request.page - 1) * request.limit,
      take: request.limit,
    });
    return new PageResponseDto(data, {
      total,
      page: request.page,
      limit: request.limit,
    });
  }

  async updateVideoLink(id: number, videoLink: string): Promise<Order> {
    const order = await this.findOne(id);
    if (order.status !== OrderStatus.PROCESSING && order.status !== OrderStatus.SENT_VIDEO && order.status !== OrderStatus.PAID) {
      throw new NotFoundException(`Không thể cập nhật video link cho đơn hàng với ID ${id} vì trạng thái không phải là PROCESSING hoặc SENT_VIDEO hoặc PAID`);
    }
    order.video_link = videoLink;
    order.status = OrderStatus.SENT_VIDEO;
    return await this.orderRepository.save(order);
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return await this.orderRepository.save(order);
  }
}
