import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';

@Module({
  imports: [
    JwtModule.register({
      secret:   'mysecret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtTokenModule {} 