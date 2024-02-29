import { ArgumentsHost, Catch, ConflictException, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Observable } from 'rxjs';

@Catch(ConflictException)
export class ConflictExceptionFilter implements RpcExceptionFilter<RpcException> {
  constructor(private readonly message?: string) {}

  catch(exception: RpcException | ConflictException, host: ArgumentsHost): Observable<unknown> {
    if (this.message === undefined || exception.message === this.message) {
      return host.switchToRpc().getData();
    }

    throw exception;
  }
}
