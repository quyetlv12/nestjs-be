import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "src/common/entity/base-entity";
import { Order } from "src/modules/orders/entities/order.entity";
import { User } from "src/modules/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";


export enum PaymentStatus { 
  SUCCESS = 'SUCCESS', // Đã thanh toán thành công và chuyển cho talent
  FAILED = 'FAILED', // Thanh toán không thành công
  REFUNDED = 'REFUNDED', // Đã hoàn tiền
	HOLDING = 'HOLDING', // Đang giữ tiền, chưa chuyển cho talent
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  MOMO = 'MOMO',
  ZALOPAY = 'ZALOPAY',
  VNPAY = 'VNPAY',
  PAYPAL = 'PAYPAL',
  CASH = 'CASH',
	SEPAY = 'SEPAY',
}

@Entity('payment')
export class Payment extends BaseEntity {

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'VND' })
  currency: string;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @JoinColumn( { name: 'orderId' })
  order: Order;

  @Column({ type: 'varchar', length: 255 })
  transactionId: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

	@JoinColumn({ name: 'userId' })
	@ManyToOne(() => User, user => user.userPayment, { nullable: false })
	@ApiProperty({ description: 'Người dùng thực hiện thanh toán', type: () => User })
  user: User;

	@JoinColumn({ name: 'talentId' })
	@ManyToOne(() => User, user => user.userPayment, { nullable: false })
	@ApiProperty({ description: 'Talent nhận thanh toán', type: () => User })
	talent: User;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;
}
