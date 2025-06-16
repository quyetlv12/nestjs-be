import { Module } from '@nestjs/common';
  import { VideoService } from './videos.service';
import { VideosController } from './videos.controller';
import { Video } from './entities/video.entity';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Video , User])],
  exports: [VideoService],
  controllers: [VideosController],
  providers: [VideoService],
})
export class VideosModule {}
