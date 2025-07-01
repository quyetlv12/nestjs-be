# Complaints Module

Module quản lý khiếu nại đơn hàng với quan hệ đến User, Order và Video.

## Tính năng

- Tạo khiếu nại mới với evidence (tối đa 5 hình ảnh)
- Xem danh sách khiếu nại (có phân trang và lọc)
- Xem chi tiết khiếu nại
- Cập nhật khiếu nại
- Giải quyết khiếu nại (chỉ admin)
- Xóa khiếu nại
- Thống kê khiếu nại
- Lọc khiếu nại theo order, video, user
- Quản lý hình ảnh trong evidence (thêm/xóa)
- **Upload hình ảnh từ FormData lên Cloudinary**

## API Endpoints

### Tạo khiếu nại
```
POST /api/complaints
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Video chất lượng kém",
  "description": "Video được giao có chất lượng thấp",
  "complaintType": "video_quality",
  "priority": "high",
  "evidence": {
    "images": [
      {
        "url": "https://example.com/screenshot1.jpg",
        "description": "Screenshot chất lượng thấp"
      },
      {
        "url": "https://example.com/screenshot2.jpg",
        "description": "So sánh với yêu cầu ban đầu"
      }
    ],
    "evidenceDescription": "Yêu cầu video chất lượng cao 1080p nhưng nhận được 480p",
    "additionalData": {
      "originalRequest": "Yêu cầu video chất lượng cao",
      "receivedQuality": "480p"
    }
  },
  "orderId": 1,
  "videoId": 1
}
```

### Upload hình ảnh evidence (FormData)
```
POST /api/complaints/1/evidence/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- image: [file] (bắt buộc)
- description: "Mô tả hình ảnh" (tùy chọn)

Response:
{
  "url": "https://res.cloudinary.com/.../image/upload/...",
  "description": "Mô tả hình ảnh"
}
```

### Lấy danh sách khiếu nại
```
GET /api/complaints?page=1&limit=10&status=pending&userId=1
Authorization: Bearer <token>
```

### Lấy thống kê khiếu nại (Admin only)
```
GET /api/complaints/stats
Authorization: Bearer <token>
```

### Lấy khiếu nại của tôi
```
GET /api/complaints/my-complaints
Authorization: Bearer <token>
```

### Lấy khiếu nại theo order
```
GET /api/complaints/order/1
Authorization: Bearer <token>
```

### Lấy khiếu nại theo video
```
GET /api/complaints/video/1
Authorization: Bearer <token>
```

### Xem chi tiết khiếu nại
```
GET /api/complaints/1
Authorization: Bearer <token>
```

### Cập nhật khiếu nại
```
PATCH /api/complaints/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Cập nhật tiêu đề",
  "description": "Cập nhật mô tả",
  "priority": "medium",
  "evidence": {
    "images": [
      {
        "url": "https://example.com/new-image.jpg",
        "description": "Hình ảnh mới"
      }
    ]
  }
}
```

### Thêm hình ảnh vào evidence (URL)
```
POST /api/complaints/1/evidence/images
Authorization: Bearer <token>
Content-Type: application/json

{
  "images": [
    {
      "url": "https://example.com/new-image1.jpg",
      "description": "Hình ảnh mới 1"
    },
    {
      "url": "https://example.com/new-image2.jpg",
      "description": "Hình ảnh mới 2"
    }
  ]
}
```

### Xóa hình ảnh khỏi evidence
```
DELETE /api/complaints/1/evidence/images/0
Authorization: Bearer <token>
```

### Giải quyết khiếu nại (Admin only)
```
PATCH /api/complaints/1/resolve
Authorization: Bearer <token>
Content-Type: application/json

{
  "resolution": "Đã xem xét và giải quyết vấn đề",
  "status": "resolved"
}
```

### Xóa khiếu nại
```
DELETE /api/complaints/1
Authorization: Bearer <token>
```

## Upload Hình Ảnh

### Yêu cầu Upload
- **Định dạng**: Chỉ chấp nhận file hình ảnh (image/*)
- **Kích thước**: Tối đa 5MB
- **Số lượng**: Tối đa 5 hình ảnh cho mỗi complaint
- **Storage**: Cloudinary

### Ví dụ Upload với JavaScript
```javascript
// Upload hình ảnh
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('description', 'Screenshot lỗi');

const response = await fetch('/api/complaints/1/evidence/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});

const result = await response.json();
console.log(result.url); // URL hình ảnh trên Cloudinary
```

### Ví dụ Upload với cURL
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "description=Screenshot lỗi" \
  http://localhost:4000/api/complaints/1/evidence/upload
```

## Cấu trúc Evidence

Evidence có thể chứa:
- **images**: Mảng tối đa 5 hình ảnh
  - `url`: URL hình ảnh (bắt buộc)
  - `description`: Mô tả hình ảnh (tùy chọn)
- **evidenceDescription**: Mô tả tổng quan về evidence
- **additionalData**: Dữ liệu bổ sung (JSON)

### Ví dụ Evidence
```json
{
  "images": [
    {
      "url": "https://res.cloudinary.com/.../image/upload/...",
      "description": "Screenshot chất lượng thấp"
    },
    {
      "url": "https://res.cloudinary.com/.../image/upload/...",
      "description": "So sánh với yêu cầu ban đầu"
    }
  ],
  "evidenceDescription": "Yêu cầu video chất lượng cao 1080p nhưng nhận được 480p",
  "additionalData": {
    "originalRequest": "Yêu cầu video chất lượng cao",
    "receivedQuality": "480p",
    "transactionId": "TXN123456"
  }
}
```

## Các trạng thái khiếu nại

- `pending`: Chờ xử lý
- `investigating`: Đang điều tra
- `resolved`: Đã giải quyết
- `rejected`: Từ chối

## Mức độ ưu tiên

- `low`: Thấp
- `medium`: Trung bình
- `high`: Cao
- `urgent`: Khẩn cấp

## Loại khiếu nại

- `video_quality`: Chất lượng video
- `delivery_time`: Thời gian giao hàng
- `content_issue`: Vấn đề nội dung
- `payment_issue`: Vấn đề thanh toán
- `other`: Khác

## Quyền truy cập

- **User thường**: Chỉ có thể xem, tạo, cập nhật, xóa khiếu nại của mình
- **Admin**: Có thể xem tất cả khiếu nại, giải quyết khiếu nại, xem thống kê

## Quan hệ dữ liệu

- **User**: Người tạo khiếu nại (bắt buộc)
- **Order**: Đơn hàng liên quan (tùy chọn)
- **Video**: Video liên quan (tùy chọn)
- **ResolvedBy**: Người giải quyết khiếu nại (tùy chọn)

## Validation

- Title: Bắt buộc, tối đa 255 ký tự
- Description: Bắt buộc
- ComplaintType: Bắt buộc, phải là một trong các giá trị enum
- Priority: Tùy chọn, mặc định là 'medium'
- Evidence.images: Tối đa 5 hình ảnh
- Evidence.images[].url: Bắt buộc, phải là URL hợp lệ
- Upload file: Chỉ hình ảnh, tối đa 5MB
- OrderId: Tùy chọn, phải là số
- VideoId: Tùy chọn, phải là số

## Lưu ý

- Mỗi khiếu nại chỉ được phép tối đa 5 hình ảnh trong evidence
- URL hình ảnh phải hợp lệ
- Khi thêm hình ảnh mới, tổng số hình ảnh không được vượt quá 5
- Chỉ user tạo khiếu nại hoặc admin mới được quản lý hình ảnh
- Hình ảnh upload sẽ được lưu trữ trên Cloudinary
- File upload phải là hình ảnh và không quá 5MB 