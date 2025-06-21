# JWT Token Service

Service để xử lý JWT token và lấy dữ liệu từ token.

## Features

### 1. Token Creation
- Tạo JWT token từ user data
- Tự động thêm expiration time

### 2. Token Verification
- Verify và decode JWT token
- Kiểm tra tính hợp lệ của token

### 3. Data Extraction
- Lấy userId, email, permissions từ token
- Lấy thông tin chi tiết từ token

### 4. Permission Checking
- Kiểm tra user có permission cụ thể không
- Kiểm tra user có bất kỳ permission nào trong danh sách
- Kiểm tra user có tất cả permissions trong danh sách

### 5. Token Management
- Kiểm tra token có hết hạn không
- Lấy thời gian hết hạn của token
- Refresh token

## Usage

### 1. Import Module

```typescript
import { JwtTokenModule } from '@/common/services/jwt.module';

@Module({
  imports: [JwtTokenModule],
  // ...
})
export class YourModule {}
```

### 2. Inject Service

```typescript
import { JwtTokenService } from '@/common/services/jwt.service';

@Injectable()
export class YourService {
  constructor(private readonly jwtTokenService: JwtTokenService) {}
}
```

### 3. Basic Usage

```typescript
// Tạo token
const token = this.jwtTokenService.createToken({
  id: user.id,
  email: user.email,
  phone: user.phone,
  nick_name: user.nick_name,
  permissions: user.permissions,
});

// Lấy dữ liệu từ token
const tokenData = this.jwtTokenService.getTokenData(token);
console.log(tokenData.userId); // 123
console.log(tokenData.email); // "user@example.com"
console.log(tokenData.permissions); // ["create_order", "view_order_list"]

// Lấy userId từ token
const userId = this.jwtTokenService.getUserIdFromToken(token);

// Lấy email từ token
const email = this.jwtTokenService.getEmailFromToken(token);

// Lấy permissions từ token
const permissions = this.jwtTokenService.getPermissionsFromToken(token);
```

### 4. Permission Checking

```typescript
// Kiểm tra permission cụ thể
const hasPermission = this.jwtTokenService.hasPermission(token, 'create_order');

// Kiểm tra có bất kỳ permission nào
const hasAny = this.jwtTokenService.hasAnyPermission(token, ['create_order', 'update_order']);

// Kiểm tra có tất cả permissions
const hasAll = this.jwtTokenService.hasAllPermissions(token, ['create_order', 'view_order_list']);
```

### 5. Token Management

```typescript
// Kiểm tra token hết hạn
const isExpired = this.jwtTokenService.isTokenExpired(token);

// Lấy thời gian hết hạn
const expiration = this.jwtTokenService.getTokenExpiration(token);

// Refresh token
const newToken = this.jwtTokenService.refreshToken(token);
```

### 6. Using with Decorators

```typescript
import { Token } from '@/common/decorators/token.decorator';

@Get('token-info')
async getTokenInfo(@Token() token: string) {
  if (!token) {
    return { error: 'No token provided' };
  }

  const tokenData = this.jwtTokenService.getTokenData(token);
  return tokenData;
}
```

## API Endpoints

### Demo Token Info
```
GET /api/orders/token-info
Authorization: Bearer <your-jwt-token>
```

Response:
```json
{
  "tokenData": {
    "userId": 1,
    "email": "user@example.com",
    "phone": "0123456789",
    "nickname": "User Name",
    "permissions": ["create_order", "view_order_list"]
  },
  "isExpired": false,
  "expiration": "2024-01-28T10:30:00.000Z",
  "hasAdminPermission": false,
  "hasOrderPermission": true
}
```

## Error Handling

```typescript
try {
  const tokenData = this.jwtTokenService.getTokenData(token);
} catch (error) {
  // Token không hợp lệ hoặc đã hết hạn
  console.error('Invalid token:', error.message);
}
```

## Best Practices

1. **Luôn kiểm tra token trước khi sử dụng**:
   ```typescript
   if (!token) {
     throw new UnauthorizedException('No token provided');
   }
   ```

2. **Sử dụng try-catch để xử lý lỗi**:
   ```typescript
   try {
     const tokenData = this.jwtTokenService.getTokenData(token);
   } catch (error) {
     throw new UnauthorizedException('Invalid token');
   }
   ```

3. **Kiểm tra permissions trước khi thực hiện action**:
   ```typescript
   if (!this.jwtTokenService.hasPermission(token, 'create_order')) {
     throw new ForbiddenException('Insufficient permissions');
   }
   ```

4. **Refresh token khi cần thiết**:
   ```typescript
   if (this.jwtTokenService.isTokenExpired(token)) {
     const newToken = this.jwtTokenService.refreshToken(token);
     // Trả về new token cho client
   }
   ```

## Security Notes

- JWT secret nên được lưu trong environment variables
- Token có thời hạn 7 ngày
- Permissions được lưu trong token để tránh query database
- Token được verify mỗi lần request 