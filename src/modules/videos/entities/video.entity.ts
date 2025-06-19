import { User } from '@/modules/users/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
  
  @Entity('videos')
  export class Video {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column()
    videoLink: string;
  
    @Column()
    thumbnailLink: string;
  
    @Column()
    duration: string;
  
    // ✅ Thêm trường createdBy (User)
    @ManyToOne(() => User, (user) => user.videos, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'createdById' })
    createdBy: User;
  
    @Column({ nullable: true })
    createdById: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @OneToMany(() => Comment, (comment) => comment.video)
    comments: Comment[];
  }
  