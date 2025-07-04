import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { R2Service } from '../../common/services/r2.service';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly r2Service: R2Service
  ) {
  }

  async create(data: CreateVideoDto & { file?: Express.Multer.File, thumbnail?: Express.Multer.File }) {

    console.log("data" , data);
    


    const user = await this.userRepository.findOne({
      where: { id: data?.createdById },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${data?.createdById} not found`,
      );
    }

    // Upload video file
    let videoLink = '';
    if (data.file) {
      await this.r2Service.uploadFile(data.file).then(data => {
        videoLink = data;
      });
    }

    // Upload thumbnail file
    let thumbnailLink = '';
    if (data.thumbnail) {
      await this.r2Service.uploadFile(data.thumbnail).then(data => {
        thumbnailLink = data;
      });
    }

    const video = this.videoRepository.create({
      ...data,
      videoLink,
      createdBy: user,
      thumbnailLink,
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
      throw new NotFoundException(`Không tìm thấy video với ID ${id}`);
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
