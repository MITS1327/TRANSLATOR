import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IsSupport = createParamDecorator((data: unknown, ctx: ExecutionContext): boolean => {
  const request = ctx.switchToHttp().getRequest();

  return !!+request.headers['mcn-support-user-id'];
});
