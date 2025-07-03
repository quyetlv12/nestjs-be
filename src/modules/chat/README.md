# Chat Module

Module chat 1 vs 1 cho phép người dùng trò chuyện với nhau, hỗ trợ gửi tin nhắn text và upload ảnh.

## Tính năng

- Chat 1 vs 1 giữa các role: Admin, Talent, Customer
- Gửi tin nhắn text
- Upload và gửi ảnh
- Đánh dấu tin nhắn đã đọc
- Đếm số tin nhắn chưa đọc
- Xóa cuộc trò chuyện

## API Endpoints

### 1. Tạo cuộc trò chuyện mới
```
POST /chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "participant2Id": 123
}
```

### 2. Lấy danh sách cuộc trò chuyện
```
GET /chat
Authorization: Bearer <token>
```

### 3. Lấy chi tiết cuộc trò chuyện
```
GET /chat/:id
Authorization: Bearer <token>
```

### 4. Gửi tin nhắn text
```
POST /chat/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello!",
  "type": "text"
}
```

### 5. Gửi tin nhắn với ảnh
```
POST /chat/:id/messages
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form data:
- image: <file>
- content: "Check this image!"
```

### 6. Đánh dấu tin nhắn đã đọc
```
PUT /chat/messages/:messageId/read
Authorization: Bearer <token>
```

### 7. Đánh dấu tất cả tin nhắn đã đọc
```
PUT /chat/:id/messages/read-all
Authorization: Bearer <token>
```

### 8. Lấy số tin nhắn chưa đọc
```
GET /chat/unread-count
Authorization: Bearer <token>
```

### 9. Xóa cuộc trò chuyện
```
DELETE /chat/:id
Authorization: Bearer <token>
```

## Quyền hạn

- `chat:create` - Tạo cuộc trò chuyện mới
- `chat:read` - Đọc tin nhắn chat
- `chat:send` - Gửi tin nhắn chat
- `chat:delete` - Xóa cuộc trò chuyện

## Cấu trúc dữ liệu

### Chat Entity
```typescript
{
  id: number;
  participant1Id: number;
  participant2Id: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  participant1: User;
  participant2: User;
  messages: ChatMessage[];
}
```

### ChatMessage Entity
```typescript
{
  id: number;
  chatId: number;
  senderId: number;
  type: 'text' | 'image' | 'file';
  content?: string;
  imageUrl?: string;
  fileName?: string;
  fileUrl?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: User;
}
```

## Upload ảnh

- Hỗ trợ định dạng: jpg, jpeg, png, gif
- Kích thước tối đa: 5MB
- Lưu trữ tại: `uploads/chat-images/`
- URL truy cập: `/uploads/chat-images/<filename>`

## Lưu ý

1. Chỉ có thể chat với người dùng khác (không thể chat với chính mình)
2. Mỗi cặp người dùng chỉ có một cuộc trò chuyện duy nhất
3. Chỉ có thể xem và gửi tin nhắn trong cuộc trò chuyện mà mình tham gia
4. Tin nhắn được sắp xếp theo thời gian tạo (cũ nhất trước)
5. Xóa cuộc trò chuyện là soft delete (chỉ ẩn, không xóa thực sự) 