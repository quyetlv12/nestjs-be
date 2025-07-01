import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Token } from 'src/common/decorators/token.decorator';
import { JwtTokenService } from 'src/common/services/jwt.service';
import { RegisterDto } from './dto/registerDto';
import { LoginDto } from './dto/loginDto';
import { UpdateProfileDto } from './dto/updateProfileDto';
import { memoryStorage } from 'multer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Token() token: string) {
    const tokenData = this.jwtTokenService.getTokenData(token);
    return this.authService.me(tokenData);
  }

  @Patch('update-profile')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'avatar', maxCount: 1 }], {
      storage: memoryStorage(),
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  updateProfile(
    @Body() updateDto: UpdateProfileDto,
    @Token() token: string,
    @UploadedFiles()
    files: { avatar?: Express.Multer.File[]},
  ) {

    const avatar = files.avatar?.[0];
    const tokenData = this.jwtTokenService.getTokenData(token);
    return this.authService.updateProfile({...updateDto , avatarFile : avatar}, +tokenData.userId);
  }
}
