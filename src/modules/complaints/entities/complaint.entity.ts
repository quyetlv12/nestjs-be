import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Order } from '../../orders/entities/order.entity';
import { Video } from '../../videos/entities/video.entity';

export enum ComplaintStatus {
  PENDING = 'pending',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

export enum ComplaintPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ComplaintType {
  VIDEO_QUALITY = 'video_quality',
  DELIVERY_TIME = 'delivery_time',
  CONTENT_ISSUE = 'content_issue',
  PAYMENT_ISSUE = 'payment_issue',
  OTHER = 'other',
}

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ComplaintStatus,
    default: ComplaintStatus.PENDING,
  })
  status: ComplaintStatus;

  @Column({
    type: 'enum',
    enum: ComplaintPriority,
    default: ComplaintPriority.MEDIUM,
  })
  priority: ComplaintPriority;

  @Column({
    type: 'enum',
    enum: ComplaintType,
  })
  complaintType: ComplaintType;

  @Column({ type: 'json', nullable: true })
  evidence?: any;

  @Column({ type: 'text', nullable: true })
  resolution?: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Order, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'orderId' })
  order?: Order;

  @Column({ name: 'orderId', nullable: true })
  orderId?: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resolvedBy' })
  resolvedBy?: User;

  @Column({ name: 'resolvedBy', nullable: true })
  resolvedById?: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
} 