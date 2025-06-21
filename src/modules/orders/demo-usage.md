# Demo: Tự động lấy userId từ JWT Token

## Cách test tính năng

### 1. Đăng nhập để lấy JWT token

```bash
# Đăng nhập với user thường
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response sẽ trả về JWT token:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "permissions": ["create_order", "view_order_list"]
  }
}
```

### 2. Tạo order mới (tự động lấy userId)

```bash
# Tạo order mới - KHÔNG cần gửi userId
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": 1,
    "description": "Tôi muốn video về sản phẩm mới",
    "budget": 1500000
  }'
```

**Lưu ý**: Không cần gửi `userId` trong request body. Hệ thống sẽ tự động lấy từ JWT token.

### 3. Xem thông tin token (Demo)

```bash
# Xem thông tin chi tiết từ JWT token
curl -X GET http://localhost:3000/orders/token-info \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
{
  "tokenData": {
    "userId": 1,
    "email": "user@example.com",
    "permissions": ["create_order", "view_order_list"]
  },
  "isExpired": false,
  "expiration": "2024-01-02T00:00:00.000Z",
  "hasAdminPermission": false,
  "hasOrderPermission": true,
  "canViewAllOrders": false,
  "canUpdateOrderStatus": false
}
```

### 4. Lấy orders của user hiện tại

```bash
# Lấy tất cả orders của user hiện tại
curl -X GET http://localhost:3000/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 5. Lấy orders của tôi (endpoint riêng)

```bash
# Lấy orders của user hiện tại (endpoint riêng)
curl -X GET http://localhost:3000/orders/my-orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 6. Test với Admin (có thể xem orders của user khác)

```bash
# Đăng nhập với admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

```bash
# Admin lấy orders của user khác
curl -X GET "http://localhost:3000/orders?userId=1" \
  -H "Authorization: Bearer <admin_token>"
```

## Logs trong console

Khi chạy các requests trên, bạn sẽ thấy logs trong console:

```
Creating order for user: 1 (user@example.com)
Fetching orders for user: 1
User 1 trying to view order 1
Access granted: User 1 viewing order 1
```

## Lợi ích của tính năng này

### 1. Bảo mật
- Không thể giả mạo userId
- Token được verify mỗi request
- Permissions được kiểm tra tự động

### 2. Tiện lợi cho Frontend
- Không cần gửi userId trong request
- Không cần lưu trữ userId ở frontend
- Tự động xác thực mỗi request

### 3. Dễ maintain
- Logic tập trung ở backend
- Không cần validate userId ở frontend
- Logging chi tiết để debug

## Cấu trúc JWT Token

Token chứa đầy đủ thông tin cần thiết:
```json
{
  "userId": 1,
  "email": "user@example.com", 
  "permissions": ["create_order", "view_order_list"],
  "iat": 1640995200,
  "exp": 1641081600
}
```

## Error Handling

Nếu token không hợp lệ hoặc hết hạn:
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

Nếu không có quyền truy cập:
```json
{
  "statusCode": 403,
  "message": "Unauthorized to view this order"
}
``` 