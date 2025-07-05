# Chat Module

Module chat với các tính năng real-time sử dụng WebSocket và Socket.IO.

## Tính năng

### ✅ Đã hoàn thành
- [x] Tạo chat giữa 2 người dùng
- [x] Gửi và nhận tin nhắn real-time
- [x] Lưu trữ tin nhắn trong database
- [x] Đánh dấu tin nhắn đã đọc
- [x] **🆕 Chỉ báo "đang nhập" (typing indicators)**
- [x] **🆕 Trạng thái online/offline của người dùng**
- [x] **🆕 Theo dõi người dùng đang hoạt động**
- [x] **🆕 Quản lý danh sách người dùng online**

## Cấu trúc Database

### Bảng `chats`
```sql
- id (Primary Key)
- participant1_id (Foreign Key -> users.id)
- participant2_id (Foreign Key -> users.id)
- isActive (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### Bảng `chat_messages`
```sql
- id (Primary Key)
- chat_id (Foreign Key -> chats.id)
- sender_id (Foreign Key -> users.id)
- type (enum: 'text', 'image', 'file')
- content (text)
- imageUrl (varchar, nullable)
- fileName (varchar, nullable)
- fileUrl (varchar, nullable)
- isRead (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

## WebSocket Events

### Client → Server

#### Kết nối
```javascript
// Kết nối với JWT token
const socket = io('http://localhost:3000', {
  auth: { token: 'your-jwt-token' }
});
```

#### Tham gia chat
```javascript
socket.emit('join_chat', { chatId: 1 });
```

#### Rời chat
```javascript
socket.emit('leave_chat', { chatId: 1 });
```

#### Gửi tin nhắn
```javascript
socket.emit('send_message', {
  chatId: 1,
  message: {
    content: 'Hello!',
    type: 'text'
  }
});
```

#### 🆕 Bắt đầu nhập
```javascript
socket.emit('start_typing', { chatId: 1 });
```

#### 🆕 Dừng nhập
```javascript
socket.emit('stop_typing', { chatId: 1 });
```

#### 🆕 Lấy danh sách người dùng online
```javascript
socket.emit('get_online_users', { chatId: 1 });
```

### Server → Client

#### Nhận tin nhắn
```javascript
socket.on('receive_message', (message) => {
  console.log('New message:', message);
});
```

#### 🆕 Người dùng đang nhập
```javascript
socket.on('user_typing', (data) => {
  console.log(`${data.username} is typing...`);
  // Hiển thị "User is typing..."
});
```

#### 🆕 Người dùng dừng nhập
```javascript
socket.on('user_stop_typing', (data) => {
  console.log(`${data.userId} stopped typing`);
  // Ẩn typing indicator
});
```

#### 🆕 Người dùng online
```javascript
socket.on('user_online', (data) => {
  console.log(`User ${data.userId} came online`);
  // Cập nhật trạng thái online
});
```

#### 🆕 Người dùng offline
```javascript
socket.on('user_offline', (data) => {
  console.log(`User ${data.userId} went offline`);
  // Cập nhật trạng thái offline
});
```

#### 🆕 Danh sách người dùng online trong chat
```javascript
socket.on('chat_online_users', (data) => {
  console.log(`Online users in chat ${data.chatId}:`, data.onlineUsers);
});
```

#### 🆕 Phản hồi danh sách người dùng online
```javascript
socket.on('online_users_response', (data) => {
  console.log(`Online users:`, data.onlineUsers);
});
```

## API Endpoints

### REST API

#### Tạo chat
```http
POST /chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "participant2Id": 2
}
```

#### Lấy danh sách chat
```http
GET /chat
Authorization: Bearer <token>
```

#### Lấy tin nhắn của chat
```http
GET /chat/:id
Authorization: Bearer <token>
```

#### Gửi tin nhắn
```http
POST /chat/:id/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello!",
  "type": "text"
}
```

#### Đánh dấu tin nhắn đã đọc
```http
PATCH /chat/:id/messages/:messageId/read
Authorization: Bearer <token>
```

#### Đánh dấu tất cả tin nhắn đã đọc
```http
PATCH /chat/:id/messages/read-all
Authorization: Bearer <token>
```

#### Lấy số tin nhắn chưa đọc
```http
GET /chat/unread-count
Authorization: Bearer <token>
```

#### Xóa chat
```http
DELETE /chat/:id
Authorization: Bearer <token>
```

## Cách sử dụng

### 1. Khởi động server
```bash
npm run start:dev
```

### 2. Test với file demo
Mở file `test-chat-features.html` trong trình duyệt để test các tính năng:

- Kết nối WebSocket với JWT token
- Tham gia/rời chat
- Gửi và nhận tin nhắn
- **🆕 Xem typing indicators**
- **🆕 Theo dõi trạng thái online/offline**
- **🆕 Xem danh sách người dùng online**

### 3. Tích hợp vào frontend

#### Kết nối WebSocket
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: 'your-jwt-token' }
});
```

#### Xử lý typing indicators
```javascript
let typingTimeout;

// Bắt đầu nhập
function handleTyping() {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  
  socket.emit('start_typing', { chatId: currentChatId });
  
  // Tự động dừng sau 2 giây
  typingTimeout = setTimeout(() => {
    socket.emit('stop_typing', { chatId: currentChatId });
  }, 2000);
}

// Lắng nghe typing events
socket.on('user_typing', (data) => {
  showTypingIndicator(data.username);
});

socket.on('user_stop_typing', (data) => {
  hideTypingIndicator();
});
```

#### Xử lý online status
```javascript
// Lắng nghe online/offline events
socket.on('user_online', (data) => {
  updateUserStatus(data.userId, 'online');
});

socket.on('user_offline', (data) => {
  updateUserStatus(data.userId, 'offline');
});

// Lấy danh sách người dùng online
socket.emit('get_online_users', { chatId: currentChatId });

socket.on('online_users_response', (data) => {
  updateOnlineUsersList(data.onlineUsers);
});
```

## Tính năng mới 🆕

### Typing Indicators
- Hiển thị khi người dùng đang nhập tin nhắn
- Tự động ẩn sau 2 giây không nhập
- Chỉ hiển thị cho người dùng khác trong cùng chat

### Online Status
- Theo dõi trạng thái online/offline real-time
- Thông báo khi người dùng kết nối/ngắt kết nối
- Lưu trữ danh sách người dùng online trong memory

### User Activity Tracking
- Map lưu trữ userId -> socketId
- Helper methods để kiểm tra trạng thái online
- Quản lý danh sách người dùng đang hoạt động

## Lưu ý

1. **JWT Token**: Cần có JWT token hợp lệ để kết nối WebSocket
2. **Memory Storage**: Danh sách người dùng online được lưu trong memory, sẽ mất khi restart server
3. **Typing Timeout**: Typing indicator tự động ẩn sau 2 giây
4. **Error Handling**: Có xử lý lỗi cho các trường hợp không hợp lệ

## Troubleshooting

### Lỗi "column does not exist"
Đã sửa lỗi naming convention trong database. Chạy lại migration nếu cần:
```bash
npm run migration:revert
npm run migration:run
```

### WebSocket không kết nối
- Kiểm tra JWT token có hợp lệ không
- Kiểm tra server có chạy không
- Kiểm tra CORS configuration

### Typing indicator không hoạt động
- Đảm bảo đã join chat trước khi gửi typing events
- Kiểm tra console log để debug 

# Chat Module - Upload Image Feature

Module chat với tính năng upload ảnh qua WebSocket và HTTP API.

## Tính năng Upload Ảnh

### 1. Upload qua WebSocket (Real-time)

**Event:** `upload_image`

**Data format:**
```javascript
{
  chatId: number,
  file: File // File object từ input hoặc drag & drop
}
```

**Ví dụ sử dụng với Socket.IO client:**

```javascript
// Kết nối socket
const socket = io('http://localhost:4000', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Upload ảnh
const fileInput = document.getElementById('imageInput');
const file = fileInput.files[0];

socket.emit('upload_image', {
  chatId: 1,
  file: file
});

// Lắng nghe response
socket.on('receive_message', (message) => {
  console.log('New image message:', message);
  // Hiển thị ảnh trong chat
});

socket.on('error', (error) => {
  console.error('Upload error:', error.message);
});
```

### 2. Upload qua HTTP API

**Endpoint:** `POST /api/chat/:chatId/upload-image`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Body:** FormData với field `image`

**Ví dụ sử dụng với JavaScript:**

```javascript
const formData = new FormData();
formData.append('image', file);

const response = await fetch(`/api/chat/1/upload-image`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-jwt-token'
  },
  body: formData
});

const result = await response.json();
console.log('Uploaded message:', result);
```

**Response format:**
```json
{
  "id": 123,
  "chatId": 1,
  "senderId": 1,
  "type": "image",
  "content": "image.jpg",
  "imageUrl": "https://pub-xxx.r2.dev/uploads/images/xxx.jpg",
  "fileName": "image.jpg",
  "fileUrl": null,
  "isRead": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "sender": {
    "id": 1,
    "username": "user1",
    "email": "user1@example.com"
  }
}
```

## Validation Rules

- **File type**: Chỉ chấp nhận hình ảnh (image/*)
- **File size**: Tối đa 10MB
- **Storage**: Cloudflare R2
- **Authentication**: JWT token required

## Error Responses

### File không phải hình ảnh
```json
{
  "message": "Chỉ chấp nhận file hình ảnh"
}
```

### File quá lớn
```json
{
  "message": "Kích thước file không được vượt quá 10MB"
}
```

### Không có quyền truy cập chat
```json
{
  "message": "Access denied"
}
```

## Các Event Socket.IO

### Client Events (emit)
- `upload_image`: Upload ảnh
- `send_message`: Gửi tin nhắn text
- `join_chat`: Tham gia chat room
- `leave_chat`: Rời chat room
- `start_typing`: Bắt đầu nhập
- `stop_typing`: Dừng nhập
- `get_online_users`: Lấy danh sách user online

### Server Events (on)
- `receive_message`: Nhận tin nhắn mới (text hoặc image)
- `user_online`: User khác online
- `user_offline`: User khác offline
- `user_typing`: User khác đang nhập
- `user_stop_typing`: User khác dừng nhập
- `chat_online_users`: Danh sách user online trong chat
- `online_users_response`: Response cho get_online_users
- `error`: Lỗi từ server

## Database Schema

### ChatMessage Entity
```typescript
{
  id: number;
  chatId: number;
  senderId: number;
  type: MessageType; // 'text' | 'image' | 'file'
  content: string; // Text content hoặc filename
  imageUrl: string; // URL ảnh trên R2
  fileName: string; // Tên file gốc
  fileUrl: string; // URL file (nếu có)
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: User;
}
```

## Frontend Integration

### React Example
```jsx
import { useState, useRef } from 'react';
import { io } from 'socket.io-client';

function ChatComponent() {
  const [socket, setSocket] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      auth: { token: localStorage.getItem('token') }
    });
    setSocket(newSocket);

    newSocket.on('receive_message', (message) => {
      if (message.type === 'image') {
        // Hiển thị ảnh
        displayImage(message);
      }
    });

    return () => newSocket.close();
  }, []);

  const handleImageUpload = () => {
    const file = fileInputRef.current.files[0];
    if (file && socket) {
      socket.emit('upload_image', {
        chatId: 1,
        file: file
      });
    }
  };

  const displayImage = (message) => {
    return (
      <div key={message.id} className="message">
        <img src={message.imageUrl} alt={message.content} />
        <span>{message.sender.username}</span>
        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
      </div>
    );
  };

  return (
    <div>
      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
      />
      {/* Chat messages */}
    </div>
  );
}
```

### Vue.js Example
```vue
<template>
  <div>
    <input 
      type="file" 
      @change="handleImageUpload"
      accept="image/*"
    />
    <div v-for="message in messages" :key="message.id">
      <img v-if="message.type === 'image'" :src="message.imageUrl" />
      <span>{{ message.sender.username }}</span>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      messages: []
    }
  },
  mounted() {
    this.socket = io('http://localhost:4000', {
      auth: { token: localStorage.getItem('token') }
    });

    this.socket.on('receive_message', (message) => {
      this.messages.push(message);
    });
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && this.socket) {
        this.socket.emit('upload_image', {
          chatId: 1,
          file: file
        });
      }
    }
  }
}
</script>
``` 