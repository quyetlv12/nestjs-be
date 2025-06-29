import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { Category } from '../categories/entities/category.entity';
import { Video } from '../videos/entities/video.entity';
import { Exclude } from 'class-transformer';
import { Comment } from '../comments/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '../payment/entities/payment.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID của người dùng', example: 1 })
  id: number;

  @Column({ length: 255 })
  @ApiProperty({ description: 'Tên của người dùng', example: 'Nguyen Van A' })
  name: string;

  @Column({ length: 255, unique: true })
  @ApiProperty({ description: 'Email của người dùng', example: 'user@example.com' })
  email: string;

  @Column({ length: 255 })
  @Exclude()
  @ApiProperty({ description: 'Mật khẩu của người dùng', example: 'securepassword123' })
  password: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Số điện thoại của người dùng', example: '+84123456789' })
  phone: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'ID của doanh nghiệp liên kết với người dùng', example: 1, nullable: true })
  business_id: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Ngày tạo người dùng', example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'Ngày cập nhật người dùng', example: '2024-01-01T00:00:00Z' })
  updatedAt: Date;

  @Column({ default: false })
  @ApiProperty({ description: 'Cho phép giao hàng trong vòng 24 giờ', example: true })
  availableFor24hDelivery: boolean;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Mô tả của người dùng', example: 'Đây là mô tả về người dùng', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ description: 'Ảnh đại diện của người dùng', example: 'https://example.com/avatar.jpg', nullable: true })
  avatar: string;

  @Column({ type: 'json', nullable: true })
  @ApiProperty({
    description: 'Danh sách các thẻ của người dùng',
    example: ['thẻ1', 'thẻ2', 'thẻ3'],
    nullable: true,
  })
  tags: string[];

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ description: 'Giá của người dùng', example: 100000, nullable: true })
  price: number;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ description: 'Công việc của người dùng', example: 'Lập trình viên', nullable: true })
  job: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Địa chỉ của người dùng', example: '123 Đường ABC, Quận 1, TP.HCM', nullable: true })
  address: string;

  @Column({ type: 'varchar', unique: true })
  @ApiProperty({ description: 'Biệt danh của người dùng', example: 'nguyenvana', uniqueItems: true })
  nick_name: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'pending'], default: 'pending' })
  @ApiProperty({
    description: 'Trạng thái của người dùng',
    example: 'active',
    enum: ['active', 'inactive', 'pending'],
  })
  status: string;

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  @ApiProperty({
    description: 'Danh sách các vai trò của người dùng',
    type: () => [Role],
    isArray: true,
  })
  roles: any[];

  @ManyToMany(() => Category, (category) => category.users)
  @JoinTable({
    name: 'user_categories', // Tên bảng trung gian
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  @ApiProperty({
    description: 'Danh sách các danh mục mà người dùng thuộc về',
    type: () => [Category],
    isArray: true,
    nullable: true,
  })
  categories?: Category[];

  @OneToMany(() => Video, (video) => video.createdBy)
  @ApiProperty({
    description: 'Danh sách các video do người dùng tạo',
    type: () => [Video],
    isArray: true,
  })
  videos: Video[];

  @OneToMany(() => Comment, (comment) => comment.user)
  @ApiProperty({
    description: 'Danh sách các bình luận của người dùng',
    type: () => [Comment],
    isArray: true,
  })
  comments: Comment[];
  
  @OneToMany(() => Payment, (payment) => payment.user)
  @ApiProperty({
    description: 'Danh sách các giao dịch thanh toán của người dùng',
    type: () => [Payment],
    isArray: true,
  })
  userPayment: Payment[];

  @OneToMany(() => Payment, (payment) => payment.talent)
  @ApiProperty({
    description: 'Danh sách các giao dịch thanh toán của talent',
    type: () => [Payment],
    isArray: true,
  })
  talentPayment: Payment[];
  
}
