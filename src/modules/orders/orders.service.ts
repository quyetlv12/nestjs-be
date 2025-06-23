import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, VideoProtocolMethod, RecipientType, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    console.log("createOrderDto" , createOrderDto);
    
    const orderData = {
      ...createOrderDto,
      video_protocol_method: createOrderDto.video_protocol_method as VideoProtocolMethod,
      recipient: createOrderDto.recipient as RecipientType,
      status: OrderStatus.PENDING,
    };
    
    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user' , 'talent'],
      order: { createdAt: 'DESC' },
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

  async findByUserId(userId: number): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['user' , 'talent'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    const updateData = { ...updateOrderDto };
    if (updateOrderDto.video_protocol_method) {
      updateData.video_protocol_method = updateOrderDto.video_protocol_method as VideoProtocolMethod;
    }
    if (updateOrderDto.recipient) {
      updateData.recipient = updateOrderDto.recipient as RecipientType;
    }
    
    Object.assign(order, updateData);
    return await this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }

  async updatePaymentStatus(id: number, paymentStatus: string): Promise<Order> {
    const order = await this.findOne(id);
    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'paid') {
      order.paymentDate = new Date();
    }
    return await this.orderRepository.save(order);
  }

  async updateVideoLink(id: number, videoLink: string): Promise<Order> {
    const order = await this.findOne(id);
    order.video_link = videoLink;
    return await this.orderRepository.save(order);
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status as OrderStatus;
    return await this.orderRepository.save(order);
  }
}
