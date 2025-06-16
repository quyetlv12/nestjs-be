import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TalentsService {
  constructor(
    @InjectRepository(User)
    private talentRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createTalentDto: any) {
    if (!createTalentDto.password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }

    if (!createTalentDto.name) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }
    if (!createTalentDto.email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    const existingTalent = await this.talentRepository.findOne({
      where: { email: createTalentDto.email },
    });

    if (existingTalent) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    createTalentDto.password = await bcrypt.hash(
      createTalentDto.password,
      saltRounds,
    );

    // Create talent with role
    const role = await this.roleRepository.findOneBy({ name: 'talent' });


    const categories = await this.categoryRepository.find({
      where: { id: In(createTalentDto.categories) },
    });

    if (!role) {
      throw new HttpException("Role 'talent' not found", HttpStatus.BAD_REQUEST);
    }

    const talent = this.talentRepository.create({
      ...createTalentDto,
      roles: [role],
      categories: categories,
    });

    return this.talentRepository.save(talent);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [talents, total] = await this.talentRepository.findAndCount({
      relations: ['categories' , 'videos'],
      where: {
        roles: { name: 'talent' },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        availableFor24hDelivery: true,
        lastCompletedVideoAt: true,
        averageVideoLength: true,
        description: true,
        reasonsToGetAVideo: true,
        address: true,
        // roles: true,
        categories: true,
      },
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: talents,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.talentRepository.findOne({
      where: { id },
      relations: ['roles' , 'videos'],
    });
  }

  findByEmail(email: string) {
    return this.talentRepository.findOne({
      where: { email },
      relations: ['roles'],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        availableFor24hDelivery: true,
        lastCompletedVideoAt: true,
        averageVideoLength: true,
        description: true,
        reasonsToGetAVideo: true,
        address: true,
        roles: true,
      },
    });
  }

  async update(id: number, updateTalentDto: any) {
    if (updateTalentDto.password) {
      const bcrypt = require('bcrypt');
      const saltRounds = 10;
      updateTalentDto.password = await bcrypt.hash(
        updateTalentDto.password,
        saltRounds,
      );
    }
    return this.talentRepository.update(id, updateTalentDto);
  }

  async remove(id: number) {
    return this.talentRepository.delete(id);
  }

  async findAllTalent() {
    return this.talentRepository.find({
      where: {
        roles: { name: 'talent' },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        availableFor24hDelivery: true,
        lastCompletedVideoAt: true,
        averageVideoLength: true,
        description: true,
        reasonsToGetAVideo: true,
        address: true,
      },
    });
  }

  async findTalentByBusinessId(businessId: number) {
    return this.talentRepository.find({
      where: { business_id: businessId, roles: { name: 'talent' } },
    });
  }
}
