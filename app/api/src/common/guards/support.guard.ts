import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { SUPPORT_ACCOUNT_ID } from '@common/constants';
import { Observable } from 'rxjs';

@Injectable()
export class OnlySupportGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const accountId = request.headers['mcn-account-id'];
    const contractId = request.headers['mcn-contract-id'];
    const supportAccountId = request.headers['mcn-support-user-id'];

    if (accountId == SUPPORT_ACCOUNT_ID || contractId == SUPPORT_ACCOUNT_ID || supportAccountId > 0) {
      return true;
    } else {
      throw new ForbiddenException('You need a support role');
    }
  }
}
