# Database Seeders

Thư mục này chứa các seeder để tạo dữ liệu mẫu cho database.

## Các Seeder có sẵn

### 1. Role & Permission Seeder
- **File**: `role.seed.ts`
- **Mô tả**: Tạo các roles và permissions cơ bản
- **Dữ liệu**: guest, user, talent, business, mod, admin

### 2. User Seeder
- **File**: `user.seed.ts`
- **Mô tả**: Tạo users mẫu cho mỗi role
- **Dữ liệu**: user@example.com, talent@example.com, admin@example.com, etc.

### 3. Category Seeder
- **File**: `category.seed.ts`
- **Mô tả**: Tạo các categories cho videos
- **Dữ liệu**: Music, Comedy, Education, etc.

### 4. Video Seeder
- **File**: `video.seed.ts`
- **Mô tả**: Tạo videos mẫu
- **Dữ liệu**: Video mẫu với talent

### 5. Comment Seeder
- **File**: `comment.seed.ts`
- **Mô tả**: Tạo comments mẫu cho videos
- **Dữ liệu**: Comments từ users khác nhau

### 6. Talent Seeder
- **File**: `talent.seed.ts`
- **Mô tả**: Tạo dữ liệu mẫu cho talents
- **Dữ liệu**: Thông tin talent profiles

### 7. Order Seeder
- **File**: `order.seed.ts`
- **Mô tả**: Tạo orders mẫu với đầy đủ các trạng thái
- **Dữ liệu**: 6 orders với các loại khác nhau

## Cách sử dụng

### Chạy tất cả seeders
```bash
npm run seed
```

### Chạy riêng order seeder
```bash
npm run seed:orders
```

### Chạy từng seeder riêng lẻ
```bash
# Tạo file seeder riêng
ts-node -r tsconfig-paths/register src/database/seeds/order-seed-only.ts
```

## Dữ liệu mẫu Orders

Seeder tạo ra 6 orders với các đặc điểm khác nhau:

### 1. Birthday Video
- **Type**: birthday_video
- **Status**: pending
- **Payment**: pending
- **Protocol**: 24hours

### 2. Anniversary Video
- **Type**: anniversary_video
- **Status**: processing
- **Payment**: paid
- **Protocol**: 7days

### 3. Graduation Video
- **Type**: graduation_video
- **Status**: completed
- **Payment**: paid
- **Protocol**: 24hours
- **Video Link**: Có link video hoàn thành

### 4. Wedding Video
- **Type**: wedding_video
- **Status**: complaint
- **Payment**: paid
- **Protocol**: 7days
- **Video Link**: Có link video hoàn thành

### 5. Promotion Video
- **Type**: promotion_video
- **Status**: refunded
- **Payment**: refunded
- **Protocol**: 24hours

### 6. Retirement Video
- **Type**: retirement_video
- **Status**: rejected
- **Payment**: refunded
- **Protocol**: 7days

## Lưu ý

- Seeder sẽ kiểm tra dữ liệu đã tồn tại trước khi tạo mới
- Các relationships được thiết lập tự động
- Dữ liệu mẫu phù hợp với business logic thực tế
- Có thể chạy nhiều lần mà không bị duplicate

## Troubleshooting

### Lỗi foreign key
- Đảm bảo đã chạy migrations trước khi seed
- Kiểm tra các bảng liên quan đã có dữ liệu

### Lỗi enum values
- Kiểm tra enum values trong entity khớp với database
- Đảm bảo migration đã tạo đúng enum types

### Lỗi connection
- Kiểm tra database connection trong `typeorm.config.ts`
- Đảm bảo database đang chạy và accessible 