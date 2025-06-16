import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { User } from '../users/user.entity';
import { Video } from './entities/video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createVideoDto: CreateVideoDto): Promise<Video> {
    const { title, videoLink, thumbnailLink, duration, createdById } = createVideoDto;

    const user = await this.userRepository.findOne({ where: { id: createdById } });
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
}
