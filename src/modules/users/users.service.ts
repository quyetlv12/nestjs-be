import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>) {
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
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: number, userData: Partial<User>) {
    return this.userRepository.update(id, userData);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}
