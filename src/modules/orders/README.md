# Orders Module API

Module quản lý đơn hàng với đầy đủ các chức năng CRUD và tính năng tự động lấy thông tin user từ JWT token.

## API Endpoints

### 1. Tạo đơn hàng mới
- **POST** `/orders`
- **Body**: `CreateOrderDto`
- **Response**: `Order`

### 2. Lấy danh sách đơn hàng
- **GET** `/orders`
- **Query Parameters**:
  - `userId` (optional): Lọc theo user ID
- **Response**: `Order[]`

### 3. Lấy thông tin đơn hàng theo ID
- **GET** `/orders/:id`
- **Response**: `Order`

### 4. Cập nhật đơn hàng
- **PATCH** `/orders/:id`
- **Body**: `UpdateOrderDto`
- **Response**: `Order`

### 5. Cập nhật trạng thái đơn hàng
- **PATCH** `/orders/:id/status`
- **Body**: `{ status: string }`
- **Response**: `Order`

### 6. Cập nhật trạng thái thanh toán
- **PATCH** `/orders/:id/payment-status`
- **Body**: `{ paymentStatus: string }`
- **Response**: `Order`

### 7. Cập nhật link video
- **PATCH** `/orders/:id/video-link`
- **Body**: `{ videoLink: string }`
- **Response**: `Order`

### 8. Xóa đơn hàng
- **DELETE** `/orders/:id`
- **Response**: `204 No Content`

## Data Models

### Order Entity
```typescript
{
  id: number;
  type: string;
  email: string;
  video_protocol_method: '7days' | '24hours';
  talentId: number;
  recipient: 'someone_else' | 'myself';
  for_gender: string;
  status: 'pending' | 'processing' | 'completed' | 'complaint' | 'resolving' | 'refunded' | 'rejected';
  price: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate?: Date;
  request_details: string;
  example_video_link?: string;
  video_from: string;
  video_from_gender: string;
  hide_video_from: boolean;
  video_link: string;
  userId: number;
  videoId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateOrderDto
```typescript
{
  type: string;
  email: string;
  video_protocol_method: '7days' | '24hours';
  talentId: number;
  recipient: 'someone_else' | 'myself';
  for_gender: string;
  price: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate?: string;
  request_details: string;
  example_video_link?: string;
  video_from: string;
  video_from_gender: string;
  hide_video_from: boolean;
  userId: number;
  videoId: number;
  video_link: string;
}
```

## Enums

### VideoProtocolMethod
- `7days`: Giao video trong 7 ngày
- `24hours`: Giao video trong 24 giờ

### RecipientType
- `someone_else`: Video cho người khác
- `myself`: Video cho chính mình

### OrderStatus
- `pending`: Chờ xử lý
- `processing`: Đang xử lý
- `completed`: Hoàn thành
- `complaint`: Khiếu nại
- `resolving`: Đang giải quyết
- `refunded`: Đã hoàn tiền
- `rejected`: Từ chối

## Relationships

- **User**: Mỗi order thuộc về một user
- **Video**: Mỗi order liên kết với một video
- **Talent**: Mỗi order có một talent được chỉ định

## Validation

- Email phải đúng định dạng
- Các enum fields phải có giá trị hợp lệ
- Price phải là số dương
- Các trường bắt buộc không được để trống 

## Tính năng chính

### 1. Tự động lấy userId từ JWT Token

Tất cả các operations trong orders controller đều tự động lấy `userId` từ JWT token:

```typescript
// Khi tạo order mới
@Post()
async create(@Body() createOrderDto: CreateOrderDto, @Token() token: string) {
  const tokenData = this.jwtTokenService.getTokenData(token);
  createOrderDto.userId = tokenData.userId; // Tự động gán userId
  return await this.ordersService.create(createOrderDto);
}
```

### 2. Kiểm tra quyền truy cập

- **User thường**: Chỉ có thể thao tác với orders của chính mình
- **Admin**: Có thể thao tác với tất cả orders
- **Talent**: Có thể cập nhật status và video link

### 3. Các endpoints chính

#### Tạo đơn hàng
```http
POST /orders
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "videoId": 1,
  "description": "Tôi muốn video về...",
  "budget": 1000000
}
```
- Tự động lấy `userId` từ JWT token
- Không cần gửi `userId` trong request body

#### Lấy danh sách đơn hàng
```http
GET /orders
Authorization: Bearer <jwt_token>
```
- Trả về orders của user hiện tại
- Admin có thể dùng `?userId=123` để xem orders của user khác

#### Lấy đơn hàng của tôi
```http
GET /orders/my-orders
Authorization: Bearer <jwt_token>
```
- Chỉ trả về orders của user hiện tại

#### Xem thông tin token (Demo)
```http
GET /orders/token-info
Authorization: Bearer <jwt_token>
```
- Trả về thông tin chi tiết từ JWT token
- Bao gồm permissions và expiration

## Cấu trúc JWT Token

Token chứa thông tin user:
```json
{
  "userId": 123,
  "email": "user@example.com",
  "permissions": ["create_order", "view_order_list"],
  "iat": 1640995200,
  "exp": 1641081600
}
```

## Bảo mật

### 1. Tự động kiểm tra quyền
```typescript
// Kiểm tra quyền xem order
if (order.userId !== tokenData.userId && 
    !this.jwtTokenService.hasPermission(token, 'view_all_orders')) {
  throw new Error('Unauthorized to view this order');
}
```

### 2. Logging chi tiết
Tất cả các operations đều có logging để theo dõi:
```typescript
console.log(`User ${tokenData.userId} trying to view order ${id}`);
console.log(`Access granted: User ${tokenData.userId} viewing order ${id}`);
```

### 3. Validation
- Kiểm tra token hợp lệ
- Kiểm tra token hết hạn
- Kiểm tra permissions

## Sử dụng

### 1. Tạo order mới
```typescript
// Frontend chỉ cần gửi thông tin order, không cần userId
const response = await fetch('/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    videoId: 1,
    description: 'Tôi muốn video về...',
    budget: 1000000
  })
});
```

### 2. Lấy orders của user
```typescript
// Tự động lấy orders của user hiện tại
const response = await fetch('/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 3. Admin lấy orders của user khác
```typescript
// Admin có thể lấy orders của user khác
const response = await fetch('/orders?userId=123', {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
```

## Dependencies

- `JwtTokenService`: Xử lý JWT token
- `JwtAuthGuard`: Bảo vệ endpoints
- `PermissionsGuard`: Kiểm tra permissions
- `@Token()` decorator: Lấy token từ request

## Lưu ý

1. **Không cần gửi userId**: Frontend không cần gửi `userId` trong request body
2. **Token bắt buộc**: Tất cả endpoints đều yêu cầu JWT token
3. **Permissions**: Kiểm tra permissions trước khi thực hiện operations
4. **Logging**: Tất cả operations đều có logging để debug
5. **Error handling**: Xử lý lỗi chi tiết với thông báo rõ ràng 