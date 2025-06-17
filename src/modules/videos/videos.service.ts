import { Get, Injectable, NotFoundException, Param, ParseIntPipe, Query, Req, Res, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { User } from '../users/user.entity';
import { Video } from './entities/video.entity';
import { UploadVideoDto } from './dto/upload-video.dto';
import { join } from 'path';
import { existsSync, statSync } from 'fs';
import { createReadStream } from 'fs';
import { Request, Response } from 'express';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    const { title, videoLink, thumbnailLink, duration, createdById } =
      createVideoDto;

    const user = await this.userRepository.findOne({
      where: { id: createdById },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${createdById} not found`);
    }

    const video = this.videoRepository.create({
      title,
      videoLink,
      thumbnailLink,
      duration,
      createdBy: user,
    });

    return await this.videoRepository.save(video);
  }

  async findAll(): Promise<Video[]> {
    return this.videoRepository.find({ relations: ['createdBy'] });
  }

  async findOne(id: number): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }
    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<Video> {
    const video = await this.findOne(id);
    Object.assign(video, updateVideoDto);
    return this.videoRepository.save(video);
  }

  async remove(id: number): Promise<void> {
    const video = await this.findOne(id);
    await this.videoRepository.remove(video);
  }

  async uploadVideo(
    file: Express.Multer.File,
    uploadVideoDto: UploadVideoDto,
  ): Promise<Video> {
    const { title, createdById } = uploadVideoDto;

    const user = await this.userRepository.findOne({
      where: { id: createdById },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${createdById} not found`);
    }

    // Save relative path for API access
    const relativePath = file.path.replace(/\\/g, '/');

    const video = this.videoRepository.create({
      title,
      videoLink: relativePath,
      thumbnailLink: '', // You would generate this
      duration: '0', // Changed to string to match entity type
      createdBy: user,
    });

    return await this.videoRepository.save(video);
  }


  async viewVideoByPath(
    @Query('path') path: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!path) throw new BadRequestException('Path parameter is required');
    const normalizedPath = path.replace(/^\/+/, '');

    if (!normalizedPath.startsWith('uploads/videos/')) {
      throw new BadRequestException('Invalid video path');
    }

    const filePath = join(process.cwd(), normalizedPath);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Video file not found');
    }

    const stat = statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
      // Trả toàn bộ video nếu không có header Range
      res.setHeader('Content-Length', fileSize);
      res.setHeader('Content-Type', 'video/mp4');
      const file = createReadStream(filePath);
      return file.pipe(res);
    }

    // Parse range header
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      res.status(416).send('Requested range not satisfiable');
      return;
    }

    const chunkSize = end - start + 1;
    const file = createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    file.pipe(res);
  }




  async streamVideo(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const video = await this.findOne(id);
    const file = createReadStream(join(process.cwd(), video.videoLink));
    return new StreamableFile(file);
  }
}
