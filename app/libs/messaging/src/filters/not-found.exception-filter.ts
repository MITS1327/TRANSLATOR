import { ArgumentsHost, Catch, NotFoundException, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Observable } from 'rxjs';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements RpcExceptionFilter<RpcException> {
  constructor(private readonly message?: string) {}

  catch(exception: RpcException | NotFoundException, host: ArgumentsHost): Observable<unknown> {
    if (this.message === undefined || exception.message === this.message) {
      return host.switchToRpc().getData();
    }

    throw exception;
  }
}
