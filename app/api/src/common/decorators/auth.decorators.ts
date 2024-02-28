import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from '@nestjs/common';

import { SUPPORT_ACCOUNT_ID } from '@common/constants';
import { OnlySupportGuard } from '@common/guards';

export const AccountId = createParamDecorator((data: unknown, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest();

  return +request.headers['mcn-account-id'];
});

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest();

  return +request.headers['mcn-user-id'];
});

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext): string | string[] => {
  const request = ctx.switchToHttp().getRequest();

  return data ? request.cookies?.[data] : request.cookies;
});

export const UserLang = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();

  return request.headers['mcn-user-lang'];
});

export const IsSupport = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const accountId = request.headers['mcn-account-id'];
  const contractId = request.headers['mcn-contract-id'];
  const supportAccountId = request.headers['mcn-support-user-id'];

  return accountId == SUPPORT_ACCOUNT_ID || contractId == SUPPORT_ACCOUNT_ID || supportAccountId > 0;
});

export const OnlySupport = () => applyDecorators(UseGuards(OnlySupportGuard));
