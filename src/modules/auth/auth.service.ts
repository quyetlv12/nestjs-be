import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { LoginDto, RegisterDto } from 'src/interfaces';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/user.entity';
import { UpdateProfileDto } from './dto/updateProfileDto';
import { TokenData } from '../../common/services/jwt.service';
import { R2Service } from '../../common/services/r2.service';
import { ChangePasswordDto } from './dto/changePasswordDto';
@Injectable()
export class AuthService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  constructor(private jwtService: JwtService, private readonly r2Service: R2Service) { }

  async register(registerDto: RegisterDto) {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerDto.email)) {
        throw new BadRequestException('Email không hợp lệ');
      }
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

      // Find the User role
      const userRole = await this.roleRepository.findOne({
        where: { name: 'user' },
      });

      if (!userRole) {
        throw new BadRequestException('Không tìm thấy vai trò');
      }

      return this.userRepository.save({
        ...registerDto,
        password: hashedPassword,
        status: 'active',
        roles: [userRole],
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
        relations: ['roles', 'roles.permissions'],
      });
      if (!user) {
        throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
      }

      if (user.status === 'pending') {
        throw new UnauthorizedException('Tài khoản đang chờ duyệt');
      }

      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Thông tin đăng nhập không hợp lệ');
      }

      const _user = _.omit(user, ['password']);

      const permissions = user.roles.reduce((acc, role) => {
        return acc.concat(
          role.permissions.map((permission) => permission.name),
        );
      }, [] as string[]);
      const tokenData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        nickname: user.nick_name,
        id: user.id,
        permissions,
        avatar: user.avatar,
      };

      const token = this.jwtService.sign(tokenData, {
        algorithm: 'HS256',
      });
      return {
        user: _user,
        token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async me(user: TokenData) {
    const _user = this.userRepository.findOne({ where: { id: user.userId } })
    return _user
  }

  async updateProfile(
    updateDto: UpdateProfileDto & { avatarFile?: Express.Multer.File },
    userId: number,
  ) {
    const _user =  await this.userRepository.findOne({ where: { id: userId } })
    if (!_user) {
      throw new UnauthorizedException('Không tìm thấy thông tin tài khoản');
    }
    let avatar = updateDto.avatar || _user.avatar;
    if (updateDto.avatarFile) {
      await this.r2Service.uploadFile(updateDto.avatarFile).then(data => {
        avatar = data;
      });
    }
    // Remove avatarFile from updateDto to avoid EntityPropertyNotFoundError
    const { avatarFile, ...updateData } = updateDto;

    await this.userRepository.update(userId, {
      ...updateData,
      avatar,
    });
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async changePassword(dto : ChangePasswordDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng');
    }

    const isOldPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Mật khẩu cũ không chính xác');
    }

    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = newHashedPassword;
    await this.userRepository.save(user);

    return { message: 'Mật khẩu đã được cập nhật thành công' };
  }
}
