# 🔌 Socket.IO Chat Test Guide

Hướng dẫn test chức năng chat real-time bằng Socket.IO trong NestJS backend.

## 📁 Files Test Đã Tạo

1. **`test-socket.html`** - Giao diện test đầy đủ với nhiều tính năng
2. **`test-socket-simple.html`** - Giao diện test đơn giản, dễ sử dụng
3. **`test-socket-console.js`** - Test bằng console/DevTools
4. **`SOCKET_TEST_GUIDE.md`** - File hướng dẫn này

## 🚀 Cách Sử Dụng

### 1. Chuẩn Bị Backend

```bash
# Đảm bảo backend đang chạy
npm run start:dev

# Kiểm tra server đang chạy ở port 3000
curl http://localhost:3000
```

### 2. Lấy JWT Token

```bash
# Đăng nhập để lấy token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

# Copy token từ response
```

### 3. Test Bằng Giao Diện Web

#### A. Test Đơn Giản (`test-socket-simple.html`)

1. Mở file `test-socket-simple.html` trong trình duyệt
2. Nhập JWT token vào ô "JWT Token"
3. Nhập Chat ID (ví dụ: 1)
4. Nhấn "Connect" để kết nối
5. Nhấn "Join Chat" để tham gia phòng chat
6. Gửi tin nhắn và xem kết quả real-time

#### B. Test Đầy Đủ (`test-socket.html`)

1. Mở file `test-socket.html` trong trình duyệt
2. Cấu hình các thông số:
   - Server URL: `http://localhost:3000`
   - JWT Token: Token đã lấy từ bước 2
   - Chat ID: ID cuộc trò chuyện muốn test
3. Sử dụng các tính năng:
   - **Connect/Disconnect**: Kết nối/ngắt kết nối
   - **Join/Leave Chat**: Tham gia/rời phòng chat
   - **Send Message**: Gửi tin nhắn
   - **Test Buttons**: Các test case khác nhau
   - **Event Log**: Xem log các sự kiện

### 4. Test Bằng Console

#### A. Sử Dụng File `test-socket-console.js`

1. Mở DevTools (F12) trong trình duyệt
2. Copy toàn bộ nội dung file `test-socket-console.js`
3. Paste vào Console và nhấn Enter
4. Sử dụng các lệnh:

```javascript
// Khởi tạo với token
socketTest.init('your-jwt-token-here');

// Kết nối
socketTest.connect();

// Tham gia chat
socketTest.joinChat(1);

// Gửi tin nhắn
socketTest.sendMessage('Hello from console!');

// Test nhiều tin nhắn
socketTest.testMultipleMessages(5, 1);

// Xem trạng thái
socketTest.status();
```

#### B. Quick Commands

```javascript
// Kết nối nhanh
quickTest.connect('your-jwt-token');

// Gửi tin nhắn nhanh
quickTest.send('Hello!', 1);

// Tham gia và gửi
quickTest.joinAndSend(1, 'Hello everyone!');

// Test nhiều tin nhắn
quickTest.testMultiple(1, 5);
```

## 🧪 Test Cases

### 1. Test Kết Nối Cơ Bản

```javascript
// Test kết nối thành công
socketTest.init('valid-token');
socketTest.connect();

// Test kết nối thất bại
socketTest.init('invalid-token');
socketTest.connect();
```

### 2. Test Gửi/Nhận Tin Nhắn

```javascript
// Gửi tin nhắn text
socketTest.sendMessage('Hello!', 'text', 1);

// Gửi tin nhắn ảnh
socketTest.sendMessage('image.jpg', 'image', 1);

// Gửi tin nhắn file
socketTest.sendMessage('document.pdf', 'file', 1);
```

### 3. Test Real-time

1. Mở 2 tab trình duyệt
2. Mỗi tab dùng token của user khác nhau
3. Cùng join một chat ID
4. Gửi tin nhắn từ tab này, xem nhận được ở tab kia

### 4. Test Typing Indicator

```javascript
// Test typing
socketTest.testTyping(1);

// Hoặc manual
socketTest.socket.emit('typing', { chatId: 1 });
setTimeout(() => {
  socketTest.socket.emit('stop_typing', { chatId: 1 });
}, 2000);
```

### 5. Test Reconnection

```javascript
// Test reconnect
socketTest.testReconnect();

// Hoặc manual
socketTest.disconnect();
setTimeout(() => socketTest.connect(), 1000);
```

## 🔍 Debug & Troubleshooting

### 1. Kiểm Tra Kết Nối

```javascript
// Xem trạng thái
socketTest.status();

// Kiểm tra socket
console.log(socketTest.socket);
```

### 2. Lỗi Thường Gặp

#### Lỗi "Connection failed"
- Kiểm tra backend có đang chạy không
- Kiểm tra URL server có đúng không
- Kiểm tra CORS configuration

#### Lỗi "Token invalid"
- Kiểm tra JWT token có hợp lệ không
- Token có hết hạn không
- Format token có đúng không

#### Lỗi "Chat not found"
- Kiểm tra Chat ID có tồn tại không
- User có quyền truy cập chat không

### 3. Log Events

```javascript
// Lắng nghe tất cả events
socketTest.socket.onAny((eventName, ...args) => {
  console.log(`Event: ${eventName}`, args);
});
```

## 📊 Monitoring

### 1. Server Logs

Kiểm tra logs của NestJS server để xem:
- Socket connections/disconnections
- Message events
- Authentication errors

### 2. Client Logs

Trong giao diện test, xem:
- Event Log section
- Connection status
- Message history

### 3. Network Tab

Trong DevTools → Network:
- WebSocket connections
- Socket.IO polling requests
- Error responses

## 🎯 Best Practices

### 1. Test Environment

- Sử dụng database test riêng
- Tạo test users với quyền phù hợp
- Clean up data sau mỗi test session

### 2. Security Testing

- Test với token invalid
- Test với user không có quyền
- Test với chat ID không tồn tại

### 3. Performance Testing

- Test với nhiều users cùng lúc
- Test với tin nhắn dài
- Test với nhiều chat rooms

## 🔧 Customization

### 1. Thêm Test Cases

```javascript
// Thêm method test mới
socketTest.testCustomFeature = function() {
  // Custom test logic
  console.log('Testing custom feature...');
};
```

### 2. Modify UI

Chỉnh sửa HTML/CSS trong các file test để:
- Thêm fields mới
- Thay đổi giao diện
- Thêm tính năng mới

### 3. Integration với Frontend

Copy logic từ các file test để tích hợp vào frontend thực tế:
- React/Vue/Angular components
- State management
- Error handling

## 📝 Notes

- Đảm bảo backend có đủ permissions cho chat module
- Test với các role khác nhau (Admin, Talent, Customer)
- Backup database trước khi test
- Document các bugs/issues tìm thấy

---

**Happy Testing! 🎉** 