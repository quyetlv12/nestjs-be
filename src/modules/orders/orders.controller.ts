import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, getSchemaPath, ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Token } from '../../common/decorators/token.decorator';
import { JwtTokenService } from '../../common/services/jwt.service';
import { OrderSearchRequestDto } from './dto/order-search-request-dto';
import { PageResponseDto } from '../../common/dto/page-response-dto';
import { Role } from '../roles/entities/role.entity';
import { HaveRole } from 'src/common/decorators/role.decorator';
import { RoleConstants } from 'src/common/constants/role.contants';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('api/orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiResponse({ 
    status: 201, 
    description: 'Đơn hàng được tạo thành công',
    type: Order 
  })
  @HaveRole(RoleConstants.USER)
  async create(
    @Body() createOrderDto: CreateOrderDto, 
    @Token() token: string
  ): Promise<Order> {
    const tokenData = this.jwtTokenService.getTokenData(token);

    return await this.ordersService.create(createOrderDto, tokenData.userId);
  }

  @Get()
  @Permissions('view_order_list')
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng' })
  @ApiResponse({
    description: 'Danh sách đơn hàng',
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Order) },
            },
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
          },
        },
      ],
    },
  })
  @ApiParam({ name: 'page', description: 'Số trang', required: false })
  @ApiParam({ name: 'limit', description: 'Số lượng đơn hàng mỗi trang', required: false })
  @ApiQuery({ name: 'status', description: 'Trạng thái đơn hàng', required: false, type: String })
  async findAll(
    @Query() request: OrderSearchRequestDto,
  ): Promise<PageResponseDto<Order>> {

    return await this.ordersService.search(request);
  }

  @Get('/me')
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của tôi' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách đơn hàng của user hiện tại',
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Order) },
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 100 },
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
              },
            },
          },
        },
      ],
    },
  })
  @ApiParam({ name: 'page', description: 'Số trang', required: false })
  @ApiParam({ name: 'limit', description: 'Số lượng đơn hàng mỗi trang', required: false })
  @ApiQuery({ name: 'status', description: 'Trạng thái đơn hàng', required: false, type: String })
  @ApiParam({ name: 'createdAt', description: 'Ngày tạo đơn hàng', required: false, type: Date })
  @ApiQuery({ name: 'updatedAt', description: 'Ngày cập nhật đơn hàng', required: false, type: Date })
  @ApiQuery({ name: 'q', description: 'Từ khóa tìm kiếm', required: false, type: String })
  @HaveRole(RoleConstants.USER)
  async getMyOrders(@Token() token: string, @Query() request: OrderSearchRequestDto): Promise<PageResponseDto<Order>> {
    const tokenData = this.jwtTokenService.getTokenData(token);

    return await this.ordersService.findByUserId(tokenData.userId, request);
  }

  @Get('/talent/me')
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của talent hiện tại' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách đơn hàng của talent hiện tại',
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Order) },
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 100 },
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 },
              },
            },
          },
        },
      ],
    },
  })
  @ApiParam({ name: 'page', description: 'Số trang', required: false })
  @ApiParam({ name: 'limit', description: 'Số lượng đơn hàng mỗi trang', required: false })
  @ApiQuery({ name: 'status', description: 'Trạng thái đơn hàng', required: false, type: String })
  @ApiQuery({ name: 'q', description: 'Từ khóa tìm kiếm', required: false, type: String })
  @HaveRole(RoleConstants.TALENT)
  async getMyTalentOrders(
    @CurrentUser() user: any, 
    @Token() token: string, 
    @Query() request: OrderSearchRequestDto
  ): Promise<PageResponseDto<Order>> {
    const tokenData = this.jwtTokenService.getTokenData(token);

    if (user.id !== tokenData.userId && !this.jwtTokenService.hasPermission(token, 'view_all_orders')) {
      throw new Error('Bạn không có quyền xem đơn hàng của talent này');
    }

    return await this.ordersService.findByTalentId(user.id, request);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin đơn hàng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin đơn hàng',
    type: Order 
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number, 
    @CurrentUser() user: any,
    @Token() token: string
  ): Promise<Order> {
    const order = await this.ordersService.findOne(id);
    const tokenData = this.jwtTokenService.getTokenData(token);

    if (order.userId !== tokenData.userId && order.talent.id !== tokenData.userId && !this.jwtTokenService.hasPermission(token, 'view_all_orders')) {
      throw new Error('Bạn không có quyền xem đơn hàng này');
    }
    return order;
  }

  @Patch(':id/accept')
  @ApiOperation({ summary: 'Chấp nhận đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Đơn hàng đã được chấp nhận',
    type: Order 
  })
  @HaveRole(RoleConstants.TALENT)
  async acceptOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<Order> {
    return await this.ordersService.accept(id, user);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Từ chối đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Đơn hàng đã bị từ chối',
    type: Order 
  })
  @HaveRole(RoleConstants.TALENT)
  async rejectOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Token() token: string
  ): Promise<Order> {
    if (!this.jwtTokenService.hasPermission(token, 'reject_order') && 
        !this.jwtTokenService.hasPermission(token, 'admin')) {
      throw new Error('Bạn không có quyền từ chối đơn hàng');
    }
    return await this.ordersService.reject(id, user);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Đơn hàng đã bị hủy',
    type: Order 
  })
  @HaveRole(RoleConstants.USER)
  async cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any
  ): Promise<Order> {
    return await this.ordersService.cancel(id, user);
  }

  @Patch(':id/video-link')
  @ApiOperation({ summary: 'Cập nhật link video' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiBody({
    description: 'Link video mới',
    type: String,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Link video được cập nhật thành công',
    type: Order 
  })
  @HaveRole(RoleConstants.TALENT)
  async updateVideoLink(
    @Param('id', ParseIntPipe) id: number,
    @Body('videoLink') videoLink: string,
    @Token() token: string
  ): Promise<Order> {
    // check permission
    return await this.ordersService.updateVideoLink(id, videoLink);
  }
}
