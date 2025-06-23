import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Token } from '../../common/decorators/token.decorator';
import { JwtTokenService } from '../../common/services/jwt.service';

@ApiTags('orders')
@ApiBearerAuth()
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
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @Permissions('create_order')
  async create(
    @Body() createOrderDto: CreateOrderDto, 
    @CurrentUser() user: any,
    @Token() token: string
  ): Promise<Order> {
    // Tự động lấy userId từ JWT token
    const tokenData = this.jwtTokenService.getTokenData(token);
    createOrderDto.userId = tokenData.userId;
    
    console.log(`Creating order for user: ${tokenData.userId} (${tokenData.email})`);
    
    return await this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách đơn hàng',
    type: [Order] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @ApiQuery({ 
    name: 'userId', 
    required: false, 
    description: 'Lọc theo user ID (chỉ admin)' 
  })
  @Permissions('view_order_list')
  async findAll(
    @CurrentUser() user: any, 
    @Query('userId') userId?: string,
    @Token() token?: string
  ): Promise<Order[]> {
    const tokenData = token ? this.jwtTokenService.getTokenData(token) : null;
    const currentUserId = tokenData?.userId || user.userId;
    
    console.log(`Fetching orders for user: ${currentUserId}`);
    
    // Nếu không có userId query, chỉ trả về orders của user hiện tại
    if (!userId) {
      return await this.ordersService.findByUserId(currentUserId);
    }
    
    // Nếu có userId query và user có quyền admin, trả về orders của user đó
    if (token && this.jwtTokenService.hasPermission(token, 'view_all_orders')) {
      console.log(`Admin fetching orders for user: ${userId}`);
      return await this.ordersService.findByUserId(parseInt(userId));
    }
    
    // Nếu không có quyền, chỉ trả về orders của chính mình
    console.log(`User ${currentUserId} trying to access orders of user ${userId} - denied`);
    return await this.ordersService.findByUserId(currentUserId);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của tôi' })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách đơn hàng của user hiện tại',
    type: [Order] 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @Permissions('view_order_list')
  async getMyOrders(@Token() token: string): Promise<Order[]> {
    const tokenData = this.jwtTokenService.getTokenData(token);
    console.log(`Fetching my orders for user: ${tokenData.userId} (${tokenData.email})`);
    
    return await this.ordersService.findByUserId(tokenData.userId);
  }

  @Get('token-info')
  @ApiOperation({ summary: 'Lấy thông tin từ JWT token (Demo)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin token' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  async getTokenInfo(@Token() token: string) {
    if (!token) {
      return { error: 'No token provided' };
    }

    try {
      const tokenData = this.jwtTokenService.getTokenData(token);
      const isExpired = this.jwtTokenService.isTokenExpired(token);
      const expiration = this.jwtTokenService.getTokenExpiration(token);
      
      return {
        tokenData,
        isExpired,
        expiration,
        hasAdminPermission: this.jwtTokenService.hasPermission(token, 'admin'),
        hasOrderPermission: this.jwtTokenService.hasPermission(token, 'create_order'),
        canViewAllOrders: this.jwtTokenService.hasPermission(token, 'view_all_orders'),
        canUpdateOrderStatus: this.jwtTokenService.hasPermission(token, 'update_order_status'),
      };
    } catch (error) {
      return { error: 'Invalid token' };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin đơn hàng theo ID' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin đơn hàng',
    type: Order 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy đơn hàng' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @Permissions('view_order_detail')
  async findOne(
    @Param('id', ParseIntPipe) id: number, 
    @CurrentUser() user: any,
    @Token() token: string
  ): Promise<Order> {
    const order = await this.ordersService.findOne(id);
    const tokenData = this.jwtTokenService.getTokenData(token);
    
    console.log(`User ${tokenData.userId} trying to view order ${id}`);
    
    // Kiểm tra quyền: chỉ cho phép xem order của chính mình hoặc admin
    if (order.userId !== tokenData.userId && !this.jwtTokenService.hasPermission(token, 'view_all_orders')) {
      console.log(`Access denied: User ${tokenData.userId} cannot view order ${id} (belongs to user ${order.userId})`);
      throw new Error('Bạn không có quyền xem đơn hàng này');
    }
    
    console.log(`Access granted: User ${tokenData.userId} viewing order ${id}`);
    return order;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Đơn hàng được cập nhật thành công',
    type: Order 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy đơn hàng' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @Permissions('update_order')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: any,
    @Token() token: string
  ): Promise<Order> {
    const order = await this.ordersService.findOne(id);
    const tokenData = this.jwtTokenService.getTokenData(token);
    
    console.log(`User ${tokenData.userId} trying to update order ${id}`);
    
    // Kiểm tra quyền: chỉ cho phép cập nhật order của chính mình hoặc admin
    if (order.userId !== tokenData.userId && !this.jwtTokenService.hasPermission(token, 'update_all_orders')) {
      console.log(`Access denied: User ${tokenData.userId} cannot update order ${id} (belongs to user ${order.userId})`);
      throw new Error('Bạn không có quyền cập nhật đơn hàng này');
    }
    
    console.log(`Access granted: User ${tokenData.userId} updating order ${id}`);
    return await this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trạng thái đơn hàng được cập nhật thành công',
    type: Order 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy đơn hàng' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @Permissions('update_order_status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @CurrentUser() user: any,
    @Token() token: string
  ): Promise<Order> {
    const order = await this.ordersService.findOne(id);
    const tokenData = this.jwtTokenService.getTokenData(token);
    
    console.log(`User ${tokenData.userId} trying to update status of order ${id} to ${status}`);
    
    // Chỉ admin hoặc talent mới có thể cập nhật status
    if (!this.jwtTokenService.hasPermission(token, 'update_order_status')) {
      console.log(`Access denied: User ${tokenData.userId} cannot update order status`);
      throw new Error('Bạn không có quyền cập nhật trạng thái đơn hàng');
    }
    
    console.log(`Access granted: User ${tokenData.userId} updating order ${id} status to ${status}`);
    return await this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/payment-status')
  @ApiOperation({ summary: 'Cập nhật trạng thái thanh toán' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trạng thái thanh toán được cập nhật thành công',
    type: Order 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy đơn hàng' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @Permissions('update_payment_status')
  async updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('paymentStatus') paymentStatus: string,
    @CurrentUser() user: any,
    @Token() token: string
  ): Promise<Order> {
    const order = await this.ordersService.findOne(id);
    const tokenData = this.jwtTokenService.getTokenData(token);
    
    console.log(`User ${tokenData.userId} trying to update payment status of order ${id} to ${paymentStatus}`);
    
    // Chỉ admin mới có thể cập nhật payment status
    if (!this.jwtTokenService.hasPermission(token, 'admin')) {
      console.log(`Access denied: User ${tokenData.userId} cannot update payment status`);
      throw new Error('Bạn không có quyền cập nhật trạng thái thanh toán');
    }
    
    console.log(`Access granted: Admin ${tokenData.userId} updating order ${id} payment status to ${paymentStatus}`);
    return await this.ordersService.updatePaymentStatus(id, paymentStatus);
  }

  @Patch(':id/video-link')
  @ApiOperation({ summary: 'Cập nhật link video' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Link video được cập nhật thành công',
    type: Order 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy đơn hàng' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @Permissions('update_video_link')
  async updateVideoLink(
    @Param('id', ParseIntPipe) id: number,
    @Body('videoLink') videoLink: string,
    @CurrentUser() user: any,
    @Token() token: string
  ): Promise<Order> {
    const order = await this.ordersService.findOne(id);
    const tokenData = this.jwtTokenService.getTokenData(token);
    
    console.log(`User ${tokenData.userId} trying to update video link for order ${id}`);
    
    // Chỉ talent hoặc admin mới có thể cập nhật video link
    if (!this.jwtTokenService.hasPermission(token, 'update_video_link') && 
        !this.jwtTokenService.hasPermission(token, 'admin')) {
      console.log(`Access denied: User ${tokenData.userId} cannot update video link`);
      throw new Error('Bạn không có quyền cập nhật link video');
    }
    
    console.log(`Access granted: User ${tokenData.userId} updating video link for order ${id}`);
    return await this.ordersService.updateVideoLink(id, videoLink);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa đơn hàng' })
  @ApiParam({ name: 'id', description: 'ID của đơn hàng' })
  @ApiResponse({ 
    status: 204, 
    description: 'Đơn hàng được xóa thành công' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy đơn hàng' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  @Permissions('delete_order')
  async remove(
    @Param('id', ParseIntPipe) id: number, 
    @CurrentUser() user: any,
    @Token() token: string
  ): Promise<void> {
    const order = await this.ordersService.findOne(id);
    const tokenData = this.jwtTokenService.getTokenData(token);
    
    console.log(`User ${tokenData.userId} trying to delete order ${id}`);
    
    // Kiểm tra quyền: chỉ cho phép xóa order của chính mình hoặc admin
    if (order.userId !== tokenData.userId && !this.jwtTokenService.hasPermission(token, 'delete_all_orders')) {
      console.log(`Access denied: User ${tokenData.userId} cannot delete order ${id} (belongs to user ${order.userId})`);
      throw new Error('Bạn không có quyền xóa đơn hàng này');
    }
    
    console.log(`Access granted: User ${tokenData.userId} deleting order ${id}`);
    return await this.ordersService.remove(id);
  }
}
