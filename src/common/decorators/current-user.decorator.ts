import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();    
    const user = request.user;    
    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      nickname: user.nickname,
      permissions: user.permissions || [],
      ...user
    };
  },
);
