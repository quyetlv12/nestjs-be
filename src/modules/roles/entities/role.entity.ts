import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { User } from 'src/modules/users/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
  
  @Entity('roles')
  export class Role {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name: string;
  
    @Column({ nullable: true })
    description: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  
    // Many-to-many with permissions
    @ManyToMany(() => Permission, (permission) => permission.roles, {
      cascade: true,
    })
    @JoinTable({
      name: 'role_permissions',
      joinColumn: { name: 'role_id', referencedColumnName: 'id' },
      inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    })
    permissions: Permission[];
  
    // Many-to-many with users (nếu có)
    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
  }
  