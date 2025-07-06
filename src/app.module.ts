import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './database/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TalentsModule } from './modules/talents/talents.module';
import { VideosModule } from './modules/videos/videos.module';
import { UploadModule } from './modules/upload/upload.module';
import { CommentsModule } from './modules/comments/comments.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions), // connect to database local
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    CategoriesModule,
    TalentsModule,
    VideosModule,
    UploadModule,
    CommentsModule,
    OrdersModule,
    PaymentModule,
    ComplaintsModule,
    ChatModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
