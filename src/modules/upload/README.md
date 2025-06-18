# Upload Module

This module provides APIs for uploading images and videos to the server.

## Features

- Upload images (JPEG, PNG, GIF, etc.)
- Upload videos (MP4, AVI, MOV, etc.)
- Automatic file type validation
- Unique filename generation
- File size limit (100MB)
- Returns file URLs for viewing

## API Endpoints

### Upload Image
**POST** `/upload/image`

Upload an image file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with field name `file` containing the image file

**Response:**
```json
{
  "statusCode": 200,
  "message": "Image uploaded successfully",
  "data": {
    "filename": "uuid-generated-filename.jpg",
    "originalName": "original-image.jpg",
    "mimetype": "image/jpeg",
    "size": 12345,
    "url": "http://localhost:4000/uploads/images/uuid-generated-filename.jpg"
  }
}
```

### Upload Video
**POST** `/upload/video`

Upload a video file.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with field name `file` containing the video file

**Response:**
```json
{
  "statusCode": 200,
  "message": "Video uploaded successfully",
  "data": {
    "filename": "uuid-generated-filename.mp4",
    "originalName": "original-video.mp4",
    "mimetype": "video/mp4",
    "size": 1234567,
    "url": "http://localhost:4000/uploads/videos/uuid-generated-filename.mp4"
  }
}
```

## File Storage

- Images are stored in: `uploads/images/`
- Videos are stored in: `uploads/videos/`
- Files are accessible via: `http://localhost:4000/uploads/{type}/{filename}`

## Configuration

The module uses the following configuration:
- File size limit: 100MB
- Supported image types: All MIME types starting with `image/`
- Supported video types: All MIME types starting with `video/`
- Base URL: Can be configured via `APP_URL` environment variable (defaults to `http://localhost:4000`)

## Error Handling

- Returns 400 Bad Request if no file is uploaded
- Returns 400 Bad Request if file type is not supported
- Returns 400 Bad Request if file size exceeds limit 