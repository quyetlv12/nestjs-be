import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateVideoDto & { file: Express.Multer.File }) {
    const user = await this.userRepository.findOne({
      where: { id: data?.createdById },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${data?.createdById} not found`,
      );
    }

    // Upload video file to Cloudinary and get the link
    let videoLink = '';
    if (data.file) {
      // Dynamically import UploadService to avoid circular dependency
      const { UploadService } = await import('../upload/upload.service');
      const uploadService = new UploadService({
        get: () => process.env.APP_URL,
      } as any);
      const result = await uploadService.uploadImageCloudinary(
        data.file,
      );
      videoLink = result.secure_url;
    }

    console.log('videoLink', videoLink);

    const video = this.videoRepository.create({
      ...data,
      videoLink: videoLink,
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
}
