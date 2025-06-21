# Authentication & Authorization Guards

Thư mục này chứa các guards để xử lý authentication và authorization trong ứng dụng.

## Guards có sẵn

### 1. JwtAuthGuard
- **File**: `jwt-auth.guard.ts`
- **Mô tả**: Guard xác thực JWT token
- **Chức năng**: 
  - Kiểm tra JWT token trong Authorization header
  - Validate token và extract user information
  - Throw UnauthorizedException nếu token không hợp lệ

### 2. PermissionsGuard
- **File**: `permissions.guard.ts`
- **Mô tả**: Guard kiểm tra quyền truy cập
- **Chức năng**:
  - Kiểm tra permissions của user
  - So sánh với required permissions từ decorator
  - Cho phép truy cập nếu user có đủ quyền

## Cách sử dụng

### 1. Sử dụng JwtAuthGuard

```typescript
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  // Tất cả endpoints trong controller này sẽ yêu cầu authentication
}
```

### 2. Sử dụng PermissionsGuard

```typescript
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrdersController {
  
  @Get()
  @Permissions('view_order_list')
  async findAll() {
    // Chỉ user có permission 'view_order_list' mới có thể truy cập
  }
}
```

### 3. Sử dụng CurrentUser decorator

```typescript
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Post()
@UseGuards(JwtAuthGuard)
async create(@Body() dto: CreateOrderDto, @CurrentUser() user: any) {
  // user object chứa thông tin từ JWT token
  console.log(user.userId, user.email, user.permissions);
}
```

## Permissions cần thiết cho Orders

### User Permissions
- `create_order` - Tạo đơn hàng mới
- `view_order_list` - Xem danh sách đơn hàng
- `view_order_detail` - Xem chi tiết đơn hàng
- `update_order` - Cập nhật đơn hàng
- `delete_order` - Xóa đơn hàng

### Admin/Talent Permissions
- `view_all_orders` - Xem tất cả đơn hàng
- `update_all_orders` - Cập nhật tất cả đơn hàng
- `delete_all_orders` - Xóa tất cả đơn hàng
- `update_order_status` - Cập nhật trạng thái đơn hàng
- `update_payment_status` - Cập nhật trạng thái thanh toán
- `update_video_link` - Cập nhật link video

## JWT Token Structure

Token JWT chứa thông tin user:

```json
{
  "email": "user@example.com",
  "phone": "0123456789",
  "name": "User Name",
  "permissions": ["view_order_list", "create_order"],
  "iat": 1640995200,
  "exp": 1641600000
}
```

## Error Handling

### 401 Unauthorized
- Token không tồn tại
- Token đã hết hạn
- Token không hợp lệ

### 403 Forbidden
- User không có đủ permissions
- User không có quyền truy cập resource

## Best Practices

1. **Luôn sử dụng cả JwtAuthGuard và PermissionsGuard**:
   ```typescript
   @UseGuards(JwtAuthGuard, PermissionsGuard)
   ```

2. **Kiểm tra quyền sở hữu resource**:
   ```typescript
   if (order.userId !== user.userId && !user.permissions.includes('admin')) {
     throw new UnauthorizedException('Unauthorized');
   }
   ```

3. **Sử dụng CurrentUser decorator** để lấy thông tin user:
   ```typescript
   @CurrentUser() user: any
   ```

4. **Định nghĩa permissions rõ ràng**:
   ```typescript
   @Permissions('view_order_list', 'create_order')
   ```

## Testing

### Test với Swagger
1. Login để lấy JWT token
2. Click "Authorize" trong Swagger UI
3. Nhập token: `Bearer <your-jwt-token>`
4. Test các endpoints

### Test với Postman
1. Set Authorization header: `Bearer <your-jwt-token>`
2. Gửi request đến protected endpoints 