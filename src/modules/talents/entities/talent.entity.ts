import { User } from '@/modules/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('talents')
export class Talent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  // Many talents belong to one user
  @ManyToOne(() => User, (user) => user.talents, {
    eager: false,
    nullable: false,
  })
  bussiness_id: User;
}
