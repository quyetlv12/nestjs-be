import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
  ComplaintType,
} from './entities/complaint.entity';
import { CreateComplaintDto, EvidenceDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { ResolveComplaintDto } from './dto/resolve-complaint.dto';
import { User } from '../users/user.entity';
import { UploadService } from '../upload/upload.service';
import { R2Service } from 'src/common/services/r2.service';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintsRepository: Repository<Complaint>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private uploadService: UploadService,
    private readonly r2Service: R2Service

  ) {}

  private validateEvidence(evidence?: EvidenceDto): void {
    if (evidence?.images && evidence.images.length > 5) {
      throw new BadRequestException(
        'Tối đa 5 hình ảnh được phép trong evidence',
      );
    }

    if (evidence?.images) {
      for (const image of evidence.images) {
        if (!image.url) {
          throw new BadRequestException('URL hình ảnh không được để trống');
        }

        // Kiểm tra định dạng URL hợp lệ
        try {
          new URL(image.url);
        } catch {
          throw new BadRequestException('URL hình ảnh không hợp lệ');
        }
      }
    }
  }

  async create(
    createComplaintDto: CreateComplaintDto & {
      evidences_file?: Express.Multer.File[];
    },
    userId: number,
  ): Promise<Complaint> {
    let evidence: any = [];

    if (
      createComplaintDto.evidences_file &&
      createComplaintDto.evidences_file.length > 0
    ) {
      // Upload each file to Cloudinary
      const uploadPromises = createComplaintDto.evidences_file.map(
        async (file) => {
          let url
          await this.r2Service.uploadFile(file).then(data => {
            url = data;
          });
          return { url };
        },
      );

      evidence = await Promise.all(uploadPromises);
    }

    // Remove evidences_file from createComplaintDto to avoid EntityPropertyNotFoundError
    const { evidences_file, ...complaintData } = createComplaintDto;

    const complaint = this.complaintsRepository.create({
      ...complaintData,
      evidence,
      userId,
    });

    return await this.complaintsRepository.save(complaint);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: ComplaintStatus,
    priority?: ComplaintPriority,
    complaintType?: ComplaintType,
    userId?: number,
  ): Promise<{ data: Complaint[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: FindOptionsWhere<Complaint> = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    if (priority) {
      where.priority = priority;
    }
    if (complaintType) {
      where.complaintType = complaintType;
    }
    const [data, total] = await this.complaintsRepository.findAndCount({
      where,
      relations: ['user', 'order', 'video', 'resolvedBy'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }

  async findOne(id: number, userId?: number): Promise<Complaint> {
    const complaint : any = await this.complaintsRepository.findOne({
      where: { id },
      relations: ['user', 'order', 'video', 'resolvedBy'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }


    // find talent

    const talent = await this.usersRepository.findOne({
      where: { id: complaint.order.talentId},
    });

    return {
      ...complaint,
      talent
    };
  }

  async update(
    id: number,
    updateComplaintDto: UpdateComplaintDto,
    userId: number,
  ): Promise<Complaint> {
    const complaint = await this.findOne(id, userId);

    // Kiểm tra quyền cập nhật - chỉ user tạo complaint hoặc admin mới được cập nhật
    if (complaint.userId !== userId) {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['roles'],
      });

      const isAdmin = user?.roles?.some((role) => role.name === 'admin');
      if (!isAdmin) {
        throw new ForbiddenException(
          'You do not have permission to update this complaint',
        );
      }
    }

    // Validate evidence nếu có cập nhật
    if (updateComplaintDto.evidence) {
      this.validateEvidence(updateComplaintDto.evidence);
    }

    Object.assign(complaint, updateComplaintDto);
    return await this.complaintsRepository.save(complaint);
  }

  async resolve(
    id: number,
    resolveComplaintDto: ResolveComplaintDto,
    resolvedById: number,
  ): Promise<Complaint> {
    const complaint = await this.findOne(id);

    Object.assign(complaint, {
      ...resolveComplaintDto,
      resolvedById,
      resolvedAt: new Date(),
    });

    return await this.complaintsRepository.save(complaint);
  }


  async priority(
    id: number,
    resolveComplaintDto: ResolveComplaintDto,
    resolvedById: number,
  ): Promise<Complaint> {
    const complaint = await this.findOne(id);

    Object.assign(complaint, {
      ...resolveComplaintDto,
      resolvedById,
      resolvedAt: new Date(),
    });

    return await this.complaintsRepository.save(complaint);
  }

  async remove(id: number, userId: number): Promise<void> {
    const complaint = await this.findOne(id, userId);

    // Kiểm tra quyền xóa - chỉ user tạo complaint hoặc admin mới được xóa
    if (complaint.userId !== userId) {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['roles'],
      });

      const isAdmin = user?.roles?.some((role) => role.name === 'admin');
      if (!isAdmin) {
        throw new ForbiddenException(
          'You do not have permission to delete this complaint',
        );
      }
    }

    await this.complaintsRepository.remove(complaint);
  }

  async getComplaintsByOrder(orderId: number): Promise<Complaint[]> {
    return await this.complaintsRepository.find({
      where: { orderId },
      relations: ['user', 'resolvedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getComplaintsByVideo(videoId: number): Promise<Complaint[]> {
    return await this.complaintsRepository.find({
      where: { videoId },
      relations: ['user', 'resolvedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getComplaintsByUser(userId: number): Promise<Complaint[]> {
    return await this.complaintsRepository.find({
      where: { userId },
      relations: ['order', 'video', 'resolvedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async getComplaintStats(): Promise<{
    total: number;
    pending: number;
    investigating: number;
    resolved: number;
    rejected: number;
  }> {
    const [total, pending, investigating, resolved, rejected] =
      await Promise.all([
        this.complaintsRepository.count(),
        this.complaintsRepository.count({
          where: { status: ComplaintStatus.PENDING },
        }),
        this.complaintsRepository.count({
          where: { status: ComplaintStatus.INVESTIGATING },
        }),
        this.complaintsRepository.count({
          where: { status: ComplaintStatus.RESOLVED },
        }),
        this.complaintsRepository.count({
          where: { status: ComplaintStatus.REJECTED },
        }),
      ]);

    return {
      total,
      pending,
      investigating,
      resolved,
      rejected,
    };
  }

  async uploadEvidenceImage(
    id: number,
    file: Express.Multer.File,
    userId: number,
    description?: string,
  ): Promise<{ url: string; description?: string }> {
    const complaint = await this.findOne(id, userId);

    // Kiểm tra quyền cập nhật
    if (complaint.userId !== userId) {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['roles'],
      });

      const isAdmin = user?.roles?.some((role) => role.name === 'admin');
      if (!isAdmin) {
        throw new ForbiddenException(
          'You do not have permission to update this complaint',
        );
      }
    }

    // Kiểm tra định dạng file
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Chỉ chấp nhận file hình ảnh');
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Kích thước file không được vượt quá 5MB');
    }

    // Lấy evidence hiện tại
    const currentEvidence = complaint.evidence || {};
    const currentImages = currentEvidence.images || [];

    // Kiểm tra số lượng hình ảnh
    if (currentImages.length >= 5) {
      throw new BadRequestException('Đã đạt tối đa 5 hình ảnh trong evidence');
    }

    try {
      // Upload lên R2
      const url = await this.r2Service.uploadFile(file);

      const newImage = {
        url,
        description: description || '',
      };

      // Thêm hình ảnh mới vào evidence
      const updatedEvidence = {
        ...currentEvidence,
        images: [...currentImages, newImage],
      };

      // Cập nhật complaint
      complaint.evidence = updatedEvidence;
      await this.complaintsRepository.save(complaint);

      return newImage;
    } catch (error) {
      throw new BadRequestException(
        'Lỗi khi upload hình ảnh: ' + error.message,
      );
    }
  }

  async addEvidenceImages(
    id: number,
    images: Array<{ url: string; description?: string }>,
    userId: number,
  ): Promise<Complaint> {
    const complaint = await this.findOne(id, userId);

    // Kiểm tra quyền cập nhật
    if (complaint.userId !== userId) {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['roles'],
      });

      const isAdmin = user?.roles?.some((role) => role.name === 'admin');
      if (!isAdmin) {
        throw new ForbiddenException(
          'You do not have permission to update this complaint',
        );
      }
    }

    // Lấy evidence hiện tại
    const currentEvidence = complaint.evidence || {};
    const currentImages = currentEvidence.images || [];

    // Kiểm tra số lượng hình ảnh
    if (currentImages.length + images.length > 5) {
      throw new BadRequestException('Tổng số hình ảnh không được vượt quá 5');
    }

    // Thêm hình ảnh mới
    const newImages = images.map((img) => ({
      url: img.url,
      description: img.description || '',
    }));

    const updatedEvidence = {
      ...currentEvidence,
      images: [...currentImages, ...newImages],
    };

    complaint.evidence = updatedEvidence;
    return await this.complaintsRepository.save(complaint);
  }

  async removeEvidenceImage(
    id: number,
    imageIndex: number,
    userId: number,
  ): Promise<Complaint> {
    const complaint = await this.findOne(id, userId);

    // Kiểm tra quyền cập nhật
    if (complaint.userId !== userId) {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
        relations: ['roles'],
      });

      const isAdmin = user?.roles?.some((role) => role.name === 'admin');
      if (!isAdmin) {
        throw new ForbiddenException(
          'You do not have permission to update this complaint',
        );
      }
    }

    const currentEvidence = complaint.evidence || {};
    const currentImages = currentEvidence.images || [];

    if (imageIndex < 0 || imageIndex >= currentImages.length) {
      throw new BadRequestException('Index hình ảnh không hợp lệ');
    }

    // Xóa hình ảnh theo index
    currentImages.splice(imageIndex, 1);

    const updatedEvidence = {
      ...currentEvidence,
      images: currentImages,
    };

    complaint.evidence = updatedEvidence;
    return await this.complaintsRepository.save(complaint);
  }
}
