// auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  email: string;
  phone?: string;
  nickname: string;
  id: number;
  permissions: string[];
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'mysecret', // nên dùng biến môi trường
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.id,
      email: payload.email,
      phone: payload.phone,
      nickname: payload.nickname,
      permissions: payload.permissions || [],
    };
  }
}
