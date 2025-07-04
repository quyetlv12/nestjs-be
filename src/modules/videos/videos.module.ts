import { Module } from '@nestjs/common';
import { VideoService } from './videos.service';
import { VideosController } from './videos.controller';
import { Video } from './entities/video.entity';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from '../comments/comments.module';
import { JwtTokenService } from 'src/common/services/jwt.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtModule } from '@nestjs/jwt';
import { R2Module } from 'src/common/services/r2.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video , User]), CommentsModule , JwtModule.register({
    secret:   'mysecret',
    signOptions: { expiresIn: '7d' },
  }),
  R2Module
],
  exports: [VideoService],
  controllers: [VideosController],
  providers: [VideoService, JwtTokenService, JwtAuthGuard, PermissionsGuard],
})
export class VideosModule {}
