import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';

export enum VideoProtocolMethod {
  SEVEN_DAYS = '7days',
  TWENTY_FOUR_HOURS = '24hours',
}

export enum RecipientType {
  SOMEONE_ELSE = 'someone_else',
  MYSELF = 'myself',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  COMPLAINT = 'complaint',
  RESOLVING = 'resolving',
  REFUNDED = 'refunded',
  REJECTED = 'rejected',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({
    type: 'enum',
    enum: VideoProtocolMethod,
    default: VideoProtocolMethod.TWENTY_FOUR_HOURS,
  })
  video_protocol_method: VideoProtocolMethod;

  @Column({ name: 'talentId' })
  talentId: number;

  @Column({
    type: 'enum',
    enum: RecipientType,
    default: RecipientType.SOMEONE_ELSE,
    name: 'recipient',
  })
  recipient: RecipientType;

  @Column({ name: 'for_gender', type: 'varchar', length: 20 })
  for_gender: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'paymentMethod', type: 'varchar', length: 50 })
  paymentMethod: string;

  @Column({ name: 'paymentStatus', type: 'varchar', length: 50 })
  paymentStatus: string;

  @Column({ name: 'paymentDate', type: 'timestamp', nullable: true })
  paymentDate?: Date;

  @Column({ name: 'request_details', type: 'text' })
  request_details: string;

  @Column({ name: 'example_video_link', type: 'varchar', length: 500, nullable: true })
  example_video_link?: string;

  @Column({ name: 'video_from', type: 'varchar', length: 255 })
  video_from: string;

  @Column({ name: 'video_from_gender', type: 'varchar', length: 20 })
  video_from_gender: string;

  @Column({ name: 'hide_video_from', type: 'boolean', default: false })
  hide_video_from: boolean;

  @Column({ name: 'video_link', type: 'varchar', length: 500 })
  video_link: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'talentId' })
  talent: User;

  @Column({ name: 'userId' })
  userId: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
