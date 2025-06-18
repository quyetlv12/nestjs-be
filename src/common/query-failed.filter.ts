import {
    Catch,
    ExceptionFilter,
    ArgumentsHost,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { QueryFailedError } from 'typeorm';
  
  @Catch(QueryFailedError)
  export class QueryFailedFilter implements ExceptionFilter {
    catch(exception: QueryFailedError, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      const error: any = exception;
  
      // Default response
      let statusCode = HttpStatus.BAD_REQUEST;
      let message = 'Database query failed';
  
      // PostgreSQL error codes
      switch (error.code) {
        case '23505': // unique_violation
          message = 'Dữ liệu đã tồn tại';
          break;
        case '23503': // foreign_key_violation
          message = 'Tham chiếu không hợp lệ';
          break;
        case '23502': // not_null_violation
          message = 'Thiếu trường bắt buộc';
          break;
        case '22P02': // invalid_text_representation
          message = 'Kiểu dữ liệu không hợp lệ';
          break;
        default:
          message = error.detail || message;
          break;
      }
  
      response.status(statusCode).json({
        statusCode,
        message,
        error: error.message,
        detail: error.detail,
      });
    }
  }
  