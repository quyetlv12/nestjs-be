import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from 'src/interfaces';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async register(registerDto: RegisterDto) {
    try {
      if (registerDto.confirmPassword !== registerDto.password) {
        throw new BadRequestException('Mật khẩu không khớp');
      }

      const user = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });
      if (user) {
        throw new BadRequestException('Email đã được sử dụng');
      }

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      return this.userRepository.save({
        ...registerDto,
        password: hashedPassword,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
