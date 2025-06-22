import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateTalentDto } from '../talents/dto/create-talent.dto';
import { UpdateTalentDto } from '../talents/dto/update-talent.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllUser() {
    return this.userRepository.find({
      select: ['id', 'name', 'email', 'avatar'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['videos'],
    });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByNickName(nickName: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { nick_name: nickName } });
  }

  async create(userData: CreateTalentDto) {
    // Validate email format
    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      throw new Error('Invalid email format');
    }
    
    // Validate required fields
    if (!userData.password) {
      throw new Error('Password is required');
    }

    if (!userData.name) {
      throw new Error('Username is required');
    }

    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);
    userData.status = 'active';
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: number, userData: UpdateTalentDto) {
    return this.userRepository.update(id, userData);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }

  async lockUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    user.status = 'inactive';
    return this.userRepository.save(user);
  }

  async unlockUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    user.status = 'active';
    return this.userRepository.save(user);
  }
}
