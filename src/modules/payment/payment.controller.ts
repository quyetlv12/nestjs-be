import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PageResponseDto } from '../../common/dto/page-response-dto';
import { Payment } from './entities/payment.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PageRequestDto } from '../../common/dto/page-request-dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

@ApiTags('payment')
@ApiBearerAuth('JWT-auth')
@Controller('api/payment')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('payment-link/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Link thanh toán', type: String })
  @ApiParam({ name: 'orderId', description: 'ID của đơn hàng', type: Number })
  async getPaymentLink(@Param('orderId') orderId: number): Promise<string> {
    return this.paymentService.getPaymentLink({ orderId });
  }

  @Get('talent/me')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Danh sách thanh toán của talent',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(Payment) },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
          },
        }
      },
    },
  })
  @ApiParam({ name: 'talentId', description: 'ID của talent', type: Number })
  async findByTalentId(@CurrentUser() currentUser: any, @Query() query: PageRequestDto): Promise<PageResponseDto<Payment>> {
    return this.paymentService.findByTalentId(currentUser.id, query);
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Danh sách thanh toán của người dùng',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(Payment) },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
          },
        }
      },
    },
  })
  async findByUserId(@CurrentUser() currentUser: any, @Query() query: PageRequestDto): Promise<PageResponseDto<Payment>> {
    return this.paymentService.findByUserId(currentUser.id, query);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Permissions('view_payment_list')
  @ApiResponse({ status: 200, description: 'Danh sách thanh toán',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(Payment) },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
          },
        }
      },
    },
  })
  async findAll(@Query() query: PageRequestDto): Promise<PageResponseDto<Payment>> {
    return this.paymentService.findAll(query);
  }
}
