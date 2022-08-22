import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const now = Date.now();

    const { method, url, body } = request;

    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.log(`${method} ${url} ${JSON.stringify(body)} ${Date.now() - now}ms`, context.getClass().name),
        ),
      );
  }
}
