# 📮 Postman Collection Guide - Chat API

Hướng dẫn sử dụng Postman collection để test Chat API của NestJS backend.

## 📁 Files Đã Tạo

1. **`Chat_API_Postman_Collection.json`** - Collection chính cho tất cả API endpoints
2. **`Chat_API_Environment.json`** - Environment variables
3. **`POSTMAN_GUIDE.md`** - File hướng dẫn này

## 🚀 Cách Import và Setup

### 1. Import Collection

1. Mở Postman
2. Click **Import** button
3. Chọn file `Chat_API_Postman_Collection.json`
4. Collection sẽ được import với tên "Chat API - NestJS Backend"

### 2. Import Environment

1. Click **Import** button
2. Chọn file `Chat_API_Environment.json`
3. Environment sẽ được import với tên "Chat API Environment"
4. Chọn environment này từ dropdown ở góc trên bên phải

### 3. Cấu Hình Environment

Cập nhật các giá trị trong environment:

```json
{
  "baseUrl": "http://localhost:3000",
  "jwtToken": "", // Sẽ được set tự động sau khi login
  "chatId": "1",
  "messageId": "1",
  "userId": "1",
  "participantId": "2",
  "adminEmail": "admin@example.com",
  "adminPassword": "password123"
}
```

## 🔐 Workflow Test Cơ Bản

### Bước 1: Authentication

1. **Login** để lấy JWT token:
   - Chọn request "🔐 Authentication > Login"
   - Body: `{"email": "admin@example.com", "password": "password123"}`
   - Send request
   - JWT token sẽ được tự động set vào environment

### Bước 2: Chat Management

2. **Create Chat**:
   - Chọn request "💬 Chat Management > Create Chat"
   - Body: `{"participant2Id": 2}`
   - Send request
   - Copy `chatId` từ response và update environment variable

3. **Get All Chats**:
   - Chọn request "💬 Chat Management > Get All Chats"
   - Send request để xem danh sách chat

4. **Get Chat by ID**:
   - Chọn request "💬 Chat Management > Get Chat by ID"
   - Send request để xem chi tiết chat và messages

### Bước 3: Send Messages

5. **Send Text Message**:
   - Chọn request "📨 Messages > Send Text Message"
   - Body: `{"content": "Hello! This is a test message.", "type": "text"}`
   - Send request

6. **Send Image Message**:
   - Chọn request "📨 Messages > Send Image Message"
   - Form-data:
     - `image`: Chọn file ảnh
     - `content`: "Check out this image!"
   - Send request

7. **Send File Message**:
   - Chọn request "📨 Messages > Send File Message"
   - Form-data:
     - `file`: Chọn file document
     - `content`: "Here's the document you requested"
   - Send request

### Bước 4: Read Status

8. **Mark Message as Read**:
   - Chọn request "👁️ Read Status > Mark Message as Read"
   - Body: `{"isRead": true}`
   - Send request

9. **Get Unread Count**:
   - Chọn request "👁️ Read Status > Get Unread Count"
   - Send request

## 🧪 Test Scenarios

### Scenario 1: Admin Chat với Customer

```bash
# 1. Login as Admin
POST {{baseUrl}}/auth/login
{
  "email": "{{adminEmail}}",
  "password": "{{adminPassword}}"
}

# 2. Create chat with customer
POST {{baseUrl}}/chat
{
  "participant2Id": {{participantId}}
}

# 3. Send message
POST {{baseUrl}}/chat/{{chatId}}/messages
{
  "content": "Hello customer!",
  "type": "text"
}
```

### Scenario 2: Customer Chat với Talent

```bash
# 1. Login as Customer
POST {{baseUrl}}/auth/login
{
  "email": "{{customerEmail}}",
  "password": "{{customerPassword}}"
}

# 2. Create chat with talent
POST {{baseUrl}}/chat
{
  "participant2Id": 3
}

# 3. Send image
POST {{baseUrl}}/chat/{{chatId}}/messages
Form-data:
  - image: [file]
  - content: "Here's my project requirement"
```

### Scenario 3: Real-time Testing

1. Mở 2 tab Postman
2. Tab 1: Login as Admin
3. Tab 2: Login as Customer
4. Cả 2 cùng join chat ID
5. Gửi tin nhắn từ tab này, kiểm tra nhận được ở tab kia

## 🔍 Advanced Testing

### 1. Search & Filter

```bash
# Search messages
GET {{baseUrl}}/chat/search?q=hello&chatId={{chatId}}

# Get messages by date range
GET {{baseUrl}}/chat/{{chatId}}/messages?startDate=2024-01-01&endDate=2024-12-31
```

### 2. Analytics

```bash
# Get chat statistics
GET {{baseUrl}}/chat/statistics

# Get user activity
GET {{baseUrl}}/chat/activity
```

### 3. Error Testing

```bash
# Test invalid token
GET {{baseUrl}}/chat
Authorization: Bearer invalid-token

# Test non-existent chat
GET {{baseUrl}}/chat/999999

# Test unauthorized access
POST {{baseUrl}}/chat/{{chatId}}/messages
# Without Authorization header
```

## 📊 Response Examples

### Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Create Chat Response
```json
{
  "id": 1,
  "participant1Id": 1,
  "participant2Id": 2,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Send Message Response
```json
{
  "id": 1,
  "chatId": 1,
  "senderId": 1,
  "type": "text",
  "content": "Hello!",
  "isRead": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Environment Variables

### Auto-set Variables
- `jwtToken`: Tự động set sau khi login thành công

### Manual Variables
- `chatId`: ID của chat conversation
- `messageId`: ID của message
- `userId`: ID của current user
- `participantId`: ID của user khác để tạo chat

### Test Data Variables
- `adminEmail`, `adminPassword`: Admin credentials
- `customerEmail`, `customerPassword`: Customer credentials
- `talentEmail`, `talentPassword`: Talent credentials

## 🎯 Best Practices

### 1. Test Flow
1. Luôn bắt đầu với Login để lấy token
2. Test Create Chat trước khi test Messages
3. Test với nhiều user roles khác nhau
4. Test error cases và edge cases

### 2. Data Management
- Backup database trước khi test
- Clean up test data sau khi test
- Sử dụng test users riêng biệt

### 3. Performance Testing
- Test với nhiều requests cùng lúc
- Test với file uploads lớn
- Monitor response times

### 4. Security Testing
- Test với invalid tokens
- Test với expired tokens
- Test authorization boundaries

## 🐛 Troubleshooting

### Common Issues

#### 1. "401 Unauthorized"
- Kiểm tra JWT token có hợp lệ không
- Token có hết hạn không
- Format Authorization header có đúng không

#### 2. "404 Not Found"
- Kiểm tra URL endpoint có đúng không
- Kiểm tra chatId/messageId có tồn tại không
- Kiểm tra user có quyền truy cập không

#### 3. "500 Internal Server Error"
- Kiểm tra backend logs
- Kiểm tra database connection
- Kiểm tra file upload permissions

#### 4. File Upload Issues
- Kiểm tra file size limits
- Kiểm tra file type restrictions
- Kiểm tra upload directory permissions

### Debug Tips

1. **Enable Postman Console**:
   - View → Show Postman Console
   - Xem detailed request/response logs

2. **Use Pre-request Scripts**:
   ```javascript
   // Log request details
   console.log('Request URL:', pm.request.url);
   console.log('Request Headers:', pm.request.headers);
   ```

3. **Use Tests Scripts**:
   ```javascript
   // Auto-set variables from response
   if (pm.response.json().access_token) {
       pm.environment.set('jwtToken', pm.response.json().access_token);
   }
   ```

## 📝 Notes

- Đảm bảo backend đang chạy trước khi test
- Cập nhật `baseUrl` nếu backend chạy ở port khác
- Backup và restore database khi cần thiết
- Document các bugs/issues tìm thấy

---

**Happy Testing! 🎉** 