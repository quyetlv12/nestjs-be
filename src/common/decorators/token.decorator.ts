import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return null;
    }
    
    // Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    
    return parts[1];
  },
); 