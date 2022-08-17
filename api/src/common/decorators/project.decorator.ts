import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Project = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const project: string = request.headers.referer?.match(/https{0,1}:\/\/([a-z]*)-[a-z]*.[a-z]*.[a-z]{2,5}/);

  return project?.[1];
});
