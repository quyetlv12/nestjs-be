import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtPayload } from '@/modules/auth/jwt.strategy';

export interface TokenData {
  userId: number;
  email: string;
  phone?: string;
  nickname: string;
  permissions: string[];
}

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: NestJwtService) {}

  /**
   * Tạo JWT token từ user data
   */
  createToken(userData: {
    id: number;
    email: string;
    phone?: string;
    nick_name: string;
    permissions: string[];
  }): string {
    const payload: JwtPayload = {
      email: userData.email,
      phone: userData.phone,
      nickname: userData.nick_name,
      id: userData.id,
      permissions: userData.permissions,
    };

    return this.jwtService.sign(payload, {
      algorithm: 'HS256',
      expiresIn: '7d',
    });
  }

  /**
   * Verify và decode JWT token
   */
  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify(token, {
        secret: 'mysecret',
      });
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Lấy dữ liệu từ JWT token
   */
  getTokenData(token: string): TokenData {
    const payload = this.verifyToken(token);
    
    return {
      userId: payload.id,
      email: payload.email,
      phone: payload.phone,
      nickname: payload.nickname,
      permissions: payload.permissions || [],
    };
  }

  /**
   * Lấy userId từ token
   */
  getUserIdFromToken(token: string): number {
    const payload = this.verifyToken(token);
    return payload.id;
  }

  /**
   * Lấy email từ token
   */
  getEmailFromToken(token: string): string {
    const payload = this.verifyToken(token);
    return payload.email;
  }

  /**
   * Lấy permissions từ token
   */
  getPermissionsFromToken(token: string): string[] {
    const payload = this.verifyToken(token);
    return payload.permissions || [];
  }

  /**
   * Kiểm tra user có permission cụ thể không
   */
  hasPermission(token: string, permission: string): boolean {
    const permissions = this.getPermissionsFromToken(token);
    return permissions.includes(permission);
  }

  /**
   * Kiểm tra user có bất kỳ permission nào trong danh sách không
   */
  hasAnyPermission(token: string, permissions: string[]): boolean {
    const userPermissions = this.getPermissionsFromToken(token);
    return permissions.some(permission => userPermissions.includes(permission));
  }

  /**
   * Kiểm tra user có tất cả permissions trong danh sách không
   */
  hasAllPermissions(token: string, permissions: string[]): boolean {
    const userPermissions = this.getPermissionsFromToken(token);
    return permissions.every(permission => userPermissions.includes(permission));
  }

  /**
   * Kiểm tra token có hết hạn không
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = this.verifyToken(token);
      if (!payload.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Lấy thời gian hết hạn của token
   */
  getTokenExpiration(token: string): Date | null {
    try {
      const payload = this.verifyToken(token);
      if (!payload.exp) return null;
      
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh token (tạo token mới với cùng payload)
   */
  refreshToken(token: string): string {
    const payload = this.verifyToken(token);
    return this.jwtService.sign(payload, {
      algorithm: 'HS256',
      expiresIn: '7d',
    });
  }
} 