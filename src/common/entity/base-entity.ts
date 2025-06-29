import { ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity as TypeOrmBaseEntity } from "typeorm";

export class BaseEntity extends TypeOrmBaseEntity {
  @ApiProperty({ description: 'ID của bản ghi', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({ description: 'Ngày tạo bản ghi', example: '2023-10-01T12:00:00Z' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty({ description: 'Ngày cập nhật bản ghi', example: '2023-10-01T12:00:00Z' })
  updatedAt: Date;
}
