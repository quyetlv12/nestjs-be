# Demo Upload Hình Ảnh Evidence

## Test Upload với cURL

### 1. Tạo complaint trước
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Upload Image",
    "description": "Test upload hình ảnh evidence",
    "complaintType": "video_quality",
    "priority": "high"
  }' \
  http://localhost:4000/api/complaints
```

### 2. Upload hình ảnh
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/your/image.jpg" \
  -F "description=Screenshot lỗi video" \
  http://localhost:4000/api/complaints/1/evidence/upload
```

### 3. Xem complaint với hình ảnh đã upload
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/complaints/1
```

## Test Upload với JavaScript

### HTML Form
```html
<!DOCTYPE html>
<html>
<head>
    <title>Upload Evidence Image</title>
</head>
<body>
    <form id="uploadForm">
        <input type="file" id="imageFile" accept="image/*" required>
        <input type="text" id="description" placeholder="Mô tả hình ảnh">
        <button type="submit">Upload</button>
    </form>
    
    <div id="result"></div>

    <script>
        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData();
            const fileInput = document.getElementById('imageFile');
            const descriptionInput = document.getElementById('description');
            
            formData.append('image', fileInput.files[0]);
            formData.append('description', descriptionInput.value);
            
            try {
                const response = await fetch('/api/complaints/1/evidence/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer YOUR_TOKEN'
                    },
                    body: formData
                });
                
                const result = await response.json();
                document.getElementById('result').innerHTML = `
                    <h3>Upload thành công!</h3>
                    <p>URL: ${result.url}</p>
                    <p>Description: ${result.description}</p>
                    <img src="${result.url}" style="max-width: 300px;">
                `;
            } catch (error) {
                document.getElementById('result').innerHTML = `
                    <h3>Lỗi upload!</h3>
                    <p>${error.message}</p>
                `;
            }
        });
    </script>
</body>
</html>
```

## Test Upload với Postman

### 1. Tạo request POST
- URL: `http://localhost:4000/api/complaints/1/evidence/upload`
- Method: `POST`

### 2. Headers
- `Authorization`: `Bearer YOUR_TOKEN`

### 3. Body
- Type: `form-data`
- Key: `image` (Type: File)
- Key: `description` (Type: Text)

### 4. Chọn file hình ảnh và gửi request

## Validation Rules

- **File type**: Chỉ chấp nhận hình ảnh (image/*)
- **File size**: Tối đa 5MB
- **Số lượng**: Tối đa 5 hình ảnh cho mỗi complaint
- **Storage**: Cloudinary

## Response Format

```json
{
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/folder/image.jpg",
  "description": "Mô tả hình ảnh"
}
```

## Error Responses

### File không phải hình ảnh
```json
{
  "statusCode": 400,
  "message": "Chỉ chấp nhận file hình ảnh"
}
```

### File quá lớn
```json
{
  "statusCode": 400,
  "message": "Kích thước file không được vượt quá 5MB"
}
```

### Đã đạt tối đa hình ảnh
```json
{
  "statusCode": 400,
  "message": "Đã đạt tối đa 5 hình ảnh trong evidence"
}
```

### Không có quyền
```json
{
  "statusCode": 403,
  "message": "You do not have permission to update this complaint"
}
``` 