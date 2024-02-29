import { ArgumentsHost, BadRequestException, Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Observable } from 'rxjs';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements RpcExceptionFilter<RpcException> {
  constructor(private readonly message?: string) {}

  catch(exception: RpcException | BadRequestException, host: ArgumentsHost): Observable<unknown> {
    if (this.message === undefined || exception.message === this.message) {
      return host.switchToRpc().getData();
    }

    throw exception;
  }
}
