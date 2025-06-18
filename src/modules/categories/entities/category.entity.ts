// src/entities/category.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @Column({nullable: true})
  slug: string;

  @Column({nullable: true})
  thumbnail: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent?: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToMany(() => User, (user) => user.categories)
  users: User[];
}
