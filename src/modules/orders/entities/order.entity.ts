import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  CANCELLED = 'cancelled',
  PAID = 'paid',
  PROCESSING = 'processing',
  SENT_VIDEO = 'sent_video',
  COMPLETED = 'completed',
  COMPLAINT = 'complaint',
  RESOLVING = 'resolving',
  REFUNDED = 'refunded',
  REJECTED = 'rejected',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID của đơn hàng', example: 1 })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @ApiProperty({ description: 'Loại đơn hàng', example: 'birthday_video' })
  type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Email để nhận thông tin đơn hàng', example: 'user@example.com' })
  email: string;

  @Column({
    type: 'enum',
    enum: VideoProtocolMethod,
    default: VideoProtocolMethod.TWENTY_FOUR_HOURS,
  })
  @ApiProperty({
    description: 'Phương thức giao video',
    enum: VideoProtocolMethod,
    default: VideoProtocolMethod.TWENTY_FOUR_HOURS,
  })
  video_protocol_method: VideoProtocolMethod;

  @Column({ name: 'talentId' })
  @ApiProperty({ description: 'ID của talent cung cấp dịch vụ', example: 1 })
  talentId: number;

  @Column({
    type: 'enum',
    enum: RecipientType,
    default: RecipientType.SOMEONE_ELSE,
    name: 'recipient',
  })
  @ApiProperty({
    description: 'Video này cho ai?',
    enum: RecipientType,
    default: RecipientType.SOMEONE_ELSE,
  })
  recipient: RecipientType;

  @Column({ name: 'for_gender', type: 'varchar', length: 20, nullable: true })
  @ApiProperty({
    description: 'Giới tính của người nhận',
    example: 'female',
  })
  for_gender: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  @ApiProperty({
    description: 'Trạng thái của đơn hàng',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'Giá của đơn hàng', example: 100.00 })
  price: number;

  @Column({ name: 'paymentMethod', type: 'varchar', length: 50, nullable: true })
  @ApiProperty({ description: 'Phương thức thanh toán', example: 'credit_card' })
  paymentMethod: string;

  @Column({ name: 'paymentDate', type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'Ngày thanh toán', example: '2024-01-01T00:00:00Z', nullable: true })
  paymentDate?: Date;

  @Column({ name: 'request_details', type: 'text' })
  @ApiProperty({
    description: 'Chi tiết yêu cầu của khách hàng',
    example: 'Tôi muốn một video chúc mừng sinh nhật với nhạc vui tươi.',
  })
  request_details: string;

  @Column({ name: 'example_video_link', type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: 'Link video mẫu', example: 'https://example.com/video.mp4', nullable: true })
  example_video_link?: string;

  @Column({ name: 'video_from', type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Nguồn video', example: 'https://example.com/video.mp4', nullable: true })
  video_from: string;

  @Column({ name: 'video_from_gender', type: 'varchar', length: 20, nullable: true })
  @ApiProperty({ description: 'Giới tính của người gửi video', example: 'male', nullable: true })
  video_from_gender: string;

  @Column({ name: 'hide_video_from', type: 'boolean', default: false, nullable: true })
  @ApiProperty({
    description: 'Ẩn video khỏi người gửi',
    example: false,
    default: false,
    nullable: true,
  })
  hide_video_from: boolean;

  @Column({ name: 'video_link', type: 'varchar', length: 500, nullable: true })
  @ApiProperty({ description: 'Link video đã hoàn thành', example: 'https://example.com/completed-video.mp4', nullable: true })
  video_link: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  @ApiProperty({ description: 'Người dùng đã tạo đơn hàng', type: () => User })
  user: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'talentId' })
  @ApiProperty({ description: 'Talent cung cấp dịch vụ', type: () => User })
  talent: User;

  @Column({ name: 'userId', nullable: true })
  @ApiProperty({ description: 'ID của người dùng đã tạo đơn hàng', example: 1, nullable: true })
  userId: number;

  @CreateDateColumn({ name: 'createdAt' })
  @ApiProperty({ description: 'Ngày tạo đơn hàng', example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  @ApiProperty({ description: 'Ngày cập nhật đơn hàng', example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;
}
