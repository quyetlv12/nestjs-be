import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { Complaint } from './entities/complaint.entity';
import { User } from '../users/user.entity';
import { Order } from '../orders/entities/order.entity';
import { Video } from '../videos/entities/video.entity';
import { JwtTokenService } from '../../common/services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from '../upload/upload.module';
import { R2Module } from '../../common/services/r2.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Complaint, User, Order, Video]),
    JwtModule.register({
      secret:   'mysecret',
      signOptions: { expiresIn: '7d' },
    }),
    UploadModule,
    R2Module
  ],
  controllers: [ComplaintsController],
  providers: [ComplaintsService, JwtTokenService],
  exports: [ComplaintsService],
})
export class ComplaintsModule {} 